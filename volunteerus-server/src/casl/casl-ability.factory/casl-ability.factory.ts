import { InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Event } from "src/events/schemas/event.schema";
import { Question } from "src/questions/schemas/question.schema";
import { Response } from "src/responses/schemas/response.schema";
import { AbilityBuilder, createMongoAbility, ExtractSubjectType } from "@casl/ability";
import { Organization } from "src/organizations/schemas/organization.schema";
import { User } from "src/users/schemas/user.schema";

type Subjects = InferSubjects<typeof Event | typeof Question | typeof Response> | typeof Organization | typeof User | 'all';

@Injectable()
export class CaslAbilityFactory {
    createForUser(role: string) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    
        // Give different users different permissions
        if (role === "ADMIN") {
            can('manage', 'all');
        } else if (role === "COMMITTEE MEMBER") {
            can('manage', 'all');
            cannot('create', Organization);
            cannot('delete', Organization);
            cannot('delete', User);
        } else if (role === "USER") {
            can('read', 'all');
            can('manage', Response);
            can('manage', User);
            cannot('delete', User);
        } else {
            can('read', 'all');
        }

        return build({
            detectSubjectType: (item) =>
            item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
