import { BlogCategory } from 'src/blog_category/entities/blog_category.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @OneToMany(() => BlogCategory, (blogCategory) => blogCategory.category)
  blog_category: BlogCategory[];
}
