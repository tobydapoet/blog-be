import { Injectable } from '@nestjs/common';
import { FollowingDto } from './dto/following.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Following } from './entities/following.entity';

@Injectable()
export class FollowingService {
  constructor(
    @InjectRepository(Following) private followingRepo: Repository<Following>,
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
    return await this.followingRepo.findOne({ where: { id: res.id } });
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
