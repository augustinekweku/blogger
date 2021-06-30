import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import firstPage from './components/pages/myFirstVuePage'
import newRoute from './components/pages/newRoute'
import hooks from './components/pages/basic/hooks'
import methods from './components/pages/basic/methods'
import comAll from './vuex/comAll'

//project pages
import home from './components/pages/home'
import tags from './admin/pages/tags'
import category from './admin/pages/category'
import adminusers from './admin/pages/adminusers'
import login from './admin/pages/login'
import role from './admin/pages/role'
import assignRole from './admin/pages/assignRole'
import createBlog from './admin/pages/createBlog'
import blogs from './admin/pages/blogs'
import editblog from './admin/pages/editblog'
import notfound from './admin/pages/notfound'


const routes = [
    //admin routes
    {
        path:  '/testvuex',
        component: comAll,
        name: 'comAll'
    },
    {
        path:  '/',
        component: home,
        name: 'home'
    },
    {
        path:  '/tags',
        component: tags,
        name: 'tags'
    },
    {
        path:  '/category',
        component: category,
        name: 'category'
    },
    {
        path:  '/createBlog',
        component: createBlog,
        name: 'createBlog'
    },
    {
        path:  '/blogs',
        component: blogs,
        name: 'blogs'
    },
    {
        path:  '/editblog/:id',
        component: editblog,
        name: 'editblog'
    },    
    {
        path:  '*',
        component: notfound,
        name: 'notfound'
    },









    {
        path:  '/adminusers',
        component: adminusers,
        name: 'adminusers'
    },
    {
        path:  '/login',
        component: login,
        name: 'login'
    },
    {
        path:  '/role',
        component: role,
        name: 'role'
    },
    {
        path:  '/assignRole',
        component: assignRole,
        name: 'assignRole'
    },
    
    









    {
        path:  '/my-new-vue-route',
        component: firstPage,

    },
    //tutorials test routes
    {
        path:  '/new-route',
        component: newRoute,

    },

    //vue hooks
    {
        path:  '/hooks',
        component: hooks,

    },

        //vue hooks
        {
            path:  '/methods',
            component: methods,
    
        },
]

export default new Router ({
    mode: 'history',
    routes,
})