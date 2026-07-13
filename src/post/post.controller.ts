import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from 'src/generated/prisma/client';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    async getPublishedPosts(): Promise<PostModel[]> {
        return this.postService.posts({
            where: { published: true }
        });
    }

    @Get(':id')
    async getPostById(@Param('id') id: string):  Promise<PostModel | null> {
        return this.postService.post({ postId: Number(id)});
    }

    

    @Get('filtered-posts/:searchString')
    async getFilteredPosts(@Param('searchString') searchString: string): Promise<PostModel[]> {
        return this.postService.posts({
            where: {
                OR: [
                    {
                        title: { contains: searchString },
                    },
                    {
                        content: { contains: searchString },
                    },
                ],
            },
        });
    }

    @Post()
    async createDraft(
        @Body() postData: { title: string; content?: string; authorEmail: string },
    ): Promise<PostModel> {
        console.log('POST DATA: ',postData);
        const { title, content, authorEmail } = postData;
        return this.postService.createPost({
            title,
            content,
            author: {
                connect: { email: authorEmail },
            },
        });
    }

    @Put('publish/:id')
    async publishPost(@Param('id') id: string): Promise<PostModel> {
        return this.postService.updatePost({
            where: { postId: Number(id) },
            data: { published: true },
        })
    }

    @Delete(':id')
    async deltePost(@Param('id') id: string): Promise<PostModel> {
        return this.postService.deletePost({ postId: Number(id) });
    }
}
