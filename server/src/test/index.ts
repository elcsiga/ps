import * as request from 'supertest';
import { Db } from 'mongodb';
import { Express } from 'express';
import { Names } from '../graphql/resolvers/resolver';

export async function testDB(db: Db, app: Express) {

    await db.collection('partners').drop().catch(() => {
    });
    await db.collection('projects').drop().catch(() => {
    });
    await db.collection('users').drop().catch(() => {
    });
    await db.collection('participants').drop().catch(() => {
    });
    await db.collection('documents').drop().catch(() => {
    });

    const QUERY = (query: string) => request(app)
        .post('/graphql')
        .send({'query': query});

    const ADD = (name: Names, payload: string) => {
        console.log(`Adding ${name.key}: ${payload}`);
        return QUERY(`mutation { ${name.add} ( ${payload} ) { id } } `)
            .expect(200)
            .then(response => response.body.data[name.add].id);
    };

    // PROJECTS

    const projectId1 = await ADD(new Names('project'), 'project: { name: "West End Estate" }');
    const projectId2 = await ADD(new Names('project'), 'project: { name: "Green Stone Apartments" }');
    const projectId3 = await ADD(new Names('project'), 'project: { name: "Monty Mountain Park" }');

    // PARTNERS

    const partnerId1 = await ADD(new Names('partner'), 'partner: { name: "Alpha Architect Studio" }');
    const partnerId2 = await ADD(new Names('partner'), 'partner: { name: "Tube a& Co. Engineering" }');
    const partnerId3 = await ADD(new Names('partner'), 'partner: { name: "Blue Steel Structures" }');

    // USERS

    const user1 = await ADD(new Names('user'),
        `partnerId: "${partnerId1}", user: { fullName: "John Doe" email: "john.doe@alpha.com" }`);
    const user2 = await ADD(new Names('user'),
        `partnerId: "${partnerId1}", user: { fullName: "Lucius Malfoy" email: "lucius.malfoy@alpha.com" }`);
    const user3 = await ADD(new Names('user'),
        `partnerId: "${partnerId1}", user: { fullName: "Dick Mobius" email: "dick.mobius@alpha.com" }`);


    // PARTICIPANTS

    const participant1 = await ADD(new Names('participant'),
        `projectId: "${projectId1}", partnerId: "${partnerId1}", participant: { role: "Architecture" }`);
    const participant2 = await ADD(new Names('participant'),
        `projectId: "${projectId1}", partnerId: "${partnerId2}", participant: { role: "Engineering" }`);
    const participant3 = await ADD(new Names('participant'),
        `projectId: "${projectId1}", partnerId: "${partnerId3}", participant: { role: "Structure" }`);

    // INTEGRITY TESTS

    QUERY(`{ users{ fullName partner {name}}}`)
        .expect({
            'data': {
                'users': [
                    {
                        'fullName': 'John Doe',
                        'partner': {
                            'name': 'Alpha Architect Studio'
                        }
                    },
                    {
                        'fullName': 'Lucius Malfoy',
                        'partner': {
                            'name': 'Alpha Architect Studio'
                        }
                    },
                    {
                        'fullName': 'Dick Mobius',
                        'partner': {
                            'name': 'Alpha Architect Studio'
                        }
                    }
                ]
            }
        });

    QUERY(`{
          projects {
            name
            participants {
              role
              partner {
                name
              }
            }
          }
        }`)
        .expect({
            "data": {
                "projects": [
                    {
                        "name": "West End Estate",
                        "participants": [
                            {
                                "role": "Architecture",
                                "partner": {
                                    "name": "Alpha Architect Studio"
                                }
                            },
                            {
                                "role": "Engineering",
                                "partner": {
                                    "name": "Tube a& Co. Engineering"
                                }
                            },
                            {
                                "role": "Structure",
                                "partner": {
                                    "name": "Blue Steel Structures"
                                }
                            }
                        ]
                    },
                    {
                        "name": "Green Stone Apartments",
                        "participants": []
                    },
                    {
                        "name": "Monty Mountain Park",
                        "participants": []
                    }
                ]
            }
        });
}
