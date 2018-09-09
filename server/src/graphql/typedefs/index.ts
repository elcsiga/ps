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
    participants: [Participant]!
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
    project(id: ID!): Project
    
    partners: [Partner!]
    partner(id: ID!): Partner
    
    users: [User!]
    user(id: ID!): User
    
    participants: [Participant!]
    participant(id: ID!): Participant
}

input ProjectInput {
    name: String!
}
input PartnerInput {
    name: String!
}
input UserInput {
    fullName: String!
    email: String!
}
input ParticipantInput {
    role: String!
}

type Mutation {
    addProject(project: ProjectInput!): Project
    updateProject(id: ID!, project: ProjectInput!): Project
    removeProject(id: ID!): Project

    addPartner(partner: PartnerInput!): Partner
    updatePartner(id: ID!, partner: PartnerInput!): Partner
    removePartner(id: ID!): Partner

    addUser(partnerId: ID!, user: UserInput!): User
    updateUser(id: ID!, user: UserInput!): User
    removeUser(id: ID!): User

    addParticipant(projectId: ID!, partnerId: ID!, participant: ParticipantInput!): Participant
    updateParticipant(id: ID!, participant: ParticipantInput!): Participant
    removeParticipant(id: ID!): Participant
}


    
`;
