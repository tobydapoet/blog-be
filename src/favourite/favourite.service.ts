import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favourite } from './entities/favourite.entity';
import { Repository } from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { Blog } from 'src/blog/entities/blog.entity';
import { FavouriteTableType } from './types/favouriteTableType';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectRepository(Favourite) private favouriteRepo: Repository<Favourite>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
  ) {}

  handleTarget = async (fav: Favourite) => {
    let target: Post | Blog | Comment | null = null;
    if (fav.favouriteTableType === FavouriteTableType.POST) {
      target = await this.postRepo.findOne({
        where: { id: fav.favouriteTableId },
      });
    } else if (fav.favouriteTableType === FavouriteTableType.COMMENT) {
      target = await this.commentRepo.findOne({
        where: { id: fav.favouriteTableId },
      });
    } else if (fav.favouriteTableType === FavouriteTableType.BLOG) {
      target = await this.blogRepo.findOne({
        where: { id: fav.favouriteTableId },
      });
    }
    return target;
  };

  async findByClient(clientId: number) {
    const favs = await this.favouriteRepo.find({
      where: { client: { id: clientId } },
    });
    if (!favs) {
      throw new NotFoundException("This client don't have favourites");
    }
    const result: Array<Favourite & { target: Post | Blog | Comment | null }> =
      [];
    for (const fav of favs) {
      const target = await this.handleTarget(fav);
      result.push({ ...fav, target });
    }

    return result;
  }

  async findOne(id: number) {
    const fav = await this.favouriteRepo.findOne({ where: { id } });
    if (!fav) {
      throw new NotFoundException("Can't find this favourite");
    }
    const target = await this.handleTarget(fav);
    return { fav, target };
  }

  async create(createFavouriteDto: CreateFavouriteDto) {
    const favourite = this.favouriteRepo.create(createFavouriteDto);
    await this.commentRepo.save(favourite);
    return this.findOne(favourite.id);
  }

  async remove(id: number) {
    const fav = await this.favouriteRepo.findOne({ where: { id } });
    if (!fav) {
      throw new NotFoundException('Not found this favourite');
    }
    return this.favouriteRepo.remove(fav);
  }
}
