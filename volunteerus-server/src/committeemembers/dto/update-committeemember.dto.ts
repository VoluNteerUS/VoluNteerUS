import { PartialType } from '@nestjs/swagger';
import { CreateCommitteeMemberDto } from './create-committeemember.dto';

export class UpdateCommitteeMemberDto extends PartialType(CreateCommitteeMemberDto) {}
