import { IUserModel } from "./../../models/userModel";

export interface IUserInput {
  userInput: IUserModel;
}

const schema = `
type UserResponse {
    data: User
    succes: Boolean!
    errorMessage: [String]!
    code: Int!
}

type LoginResponse {
    data: AuthData,
    succes: Boolean!
    errorMessage: [String]!
    code: Int!
}

type Response {
    succes: Boolean!
    errorMessage: [String]!
    code: Int!
}

type Locale {
    id: Int
    name: String
    key: String
}

type LocalesResponse {
    locales: [Locale]
    succes: Boolean!
    errorMessage: [String]!
    code: Int!
}

type User {
    id: ID!
    email: String!
    password: String
    company: String!
    status: Int!
}

type AuthData {
    token: String!
    refreshToken: String!
    userId: String
}

input UserInputData {
    email: String!
    name: String
    password: String!
    company: String!
}

type RootQuery {
    login(email: String!, password: String!): LoginResponse!
    refresh(refreshToken: String!): LoginResponse!
    locales: LocalesResponse!
    userInfo: UserResponse!
}

type RootMutation {
    signup(userInput: UserInputData): UserResponse!
    verify(token: String!): UserResponse!
    resetPassword(token: String!, email: String!, password: String!, repeatPassword: String!): Response!
    resetPasswordRequest(email: String!): Response!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`;

export default schema;
