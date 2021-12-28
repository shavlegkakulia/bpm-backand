import { mergeResolvers } from '@graphql-tools/merge';
import PatientResolver from './patientResolver';
import UserResolver from './userResolver';

const resolvers = [PatientResolver, UserResolver];

export default mergeResolvers(resolvers);