import { Injectable } from '@nestjs/common';
import { FollowingDto } from './dto/following.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Following } from './entities/following.entity';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/types/notification';

@Injectable()
export class FollowingService {
  constructor(
    @InjectRepository(Following) private followingRepo: Repository<Following>,
    private notificationService: NotificationService,
  ) {}
  async create(followingDto: FollowingDto) {
    if (followingDto.clientId === followingDto.followedId) {
      throw new Error("Can't follow yourself!");
    }
    const existing = await this.followingRepo.findOne({
      where: {
        follower: { id: followingDto.clientId },
        followed: { id: followingDto.followedId },
      },
    });
    if (existing) {
      throw new Error('Already follow this client!');
    }
    const following = this.followingRepo.create({
      follower: { id: followingDto.clientId },
      followed: { id: followingDto.followedId },
    });
    const res = await this.followingRepo.save(following);
    const followingRes = await this.followingRepo.findOne({
      where: { id: res.id },
    });
    if (followingRes) {
      return this.notificationService.create({
        clientId: res.followed.id,
        message: `${res.follower.account.name} justed follow you!`,
        refId: res.id,
        type: NotificationType.FOLLOW,
      });
    }
    return followingRes;
  }

  findByFollower(id: number) {
    return this.followingRepo.find({ where: { follower: { id } } });
  }

  findByFollowed(id: number) {
    return this.followingRepo.find({ where: { followed: { id } } });
  }

  remove(followingDto: FollowingDto) {
    return this.followingRepo.delete({
      follower: { id: followingDto.clientId },
      followed: { id: followingDto.followedId },
    });
  }
}
