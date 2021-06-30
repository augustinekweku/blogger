<template>
    <div>
        <h1>
            Methods and more
        </h1>
        <h3>The number is {{views}}</h3>
        <button @click="updateCounter(1)">Increase</button>
        <button @click="updateCounter(-1)">Decrease</button>
        <br>
        <br>

        <div v-for="(blog, i) in blogs" :key="i" v-if="blogs.length">
            <h1>{{blog.title}}</h1>
            <p>{{blog.post}}</p>
        </div>

        <br>
        <br>
        <div>
            <h1 v-if="showItem">Show this item if "showItem" is true</h1>
            <h1 v-if="!showItem">Show this item if "showItem" is false</h1>
            <button @click="showItem = !showItem">showItem</button>
        </div>


    </div>
</template>

<script>
export default {
    data() {
        return {
            views: 0,
            blogs: [],
            showItem: false
        }
    },
    methods: {
        updateCounter(number) {
            this.views += number
        }
    },
    created() {
        //call the server to get the views of the blog post...
        this.views = 100
        //get the blog posts
        let posts = [
            {title: 'this is the blog title', 'post' : 'this is the blog post', id: 1},
                {title: 'this is the blog title 1', post : 'this is the blog post', id: 2},
                {title: 'this is the blog title 2', post : 'this is the blog post', id: 3},
                {title: 'this is the blog title 3', post : 'this is the blog post', id: 4}, 
        ]
        this.blogs = posts 
    }
}
</script>