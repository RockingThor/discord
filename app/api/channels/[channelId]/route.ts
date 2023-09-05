import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 403 });
        }
        const { channelId } = params;
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 401 });
        }
        if (!channelId) {
            return new NextResponse("Channel ID Missing", { status: 401 });
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    delete: {
                        id: channelId,
                        name: {
                            not: "general",
                        },
                    },
                },
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log("[CHANNEL-DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 403 });
        }
        const { channelId } = params;
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 401 });
        }
        if (!channelId) {
            return new NextResponse("Channel ID Missing", { status: 401 });
        }
        if (name === "general") {
            return new NextResponse(
                "Channel with name 'general' can't be modified",
                { status: 400 }
            );
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "general",
                            },
                        },
                        data: {
                            name,
                            type,
                        },
                    },
                },
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log("[CHANNEL-ID-PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
