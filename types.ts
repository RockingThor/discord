"use client";
import { Server, Member, Profile, Channel } from "@prisma/client";

export type ServerWithMembersWithProfles = Server & {
    members: Member & { profile: Profile }[];
};
