import { PrismaClient, VideoGame, Book } from '@prisma/client';

let prisma: PrismaClient;
prisma = new PrismaClient();

export default prisma;