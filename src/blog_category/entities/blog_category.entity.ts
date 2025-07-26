import { Blog } from 'src/blog/entities/blog.entity';
import { Category } from 'src/category/entities/category.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blog_category')
export class BlogCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Blog, (blog) => blog.blog_categories, {
    eager: false,
    cascade: false,
  })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @ManyToOne(() => Category, (category) => category.blog_category, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
