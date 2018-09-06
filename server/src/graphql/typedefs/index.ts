export const typeDefs = `

type Project {
    id:  ID!
    name: String!
    participants: [Participant]!
}

type Partner {
    id:  String!
    name: String!
    users: [User]!
    participations: [Participant]
}

type User {
    id:  ID!
    partnerId: ID! 
    partner: Partner!
    email: String!
    fullName: String
    phone: String
}

type Participant {
    id: ID!
    partnerId: ID!
    partner: Partner!
    projectId: ID!
    project: Project!
    documents: [Document]!
    role: String!
}

type Document {
    id:  ID!
    participantId: ID!
    participant: Participant!
    title: String
    description: String
}

type Query {
    projects: [Project!]
    project(id: String!): Project
    
    partners: [Partner!]
    partner(id: String!): Partner
}

input ProjectInput {
    name: String!
}

type Mutation {
    addProject(project: ProjectInput!): Project
}
    
`;
