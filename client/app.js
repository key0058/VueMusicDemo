(function (Vue) {

    const songList =  [
        {id: 1, name: 'song1', poster: 'assets/img/李克勤.jpg'},
        {id: 2, name: 'song2', poster: 'assets/img/岳云鹏.jpg'},
        {id: 3, name: 'song3', poster: 'assets/img/谭咏麟.jpg'},
    ];

    var loadTemplate = function (templateName) {
        return document.getElementById(templateName).innerHTML;
    }

    var Home = Vue.extend({
        template: loadTemplate("home-template")
    })

    var List = Vue.extend({
        template: loadTemplate("list-template"),
        data: function() {
            this.$http.jsonp("http://localhost:2080/api/music")
                .then(res => {
                    console.log(res);
                    this.songs = res.data;
                })
                .catch(err => {
                    console.log(err);
                    this.songs = songList;
                });
            return {
                songs: []
            }
        },
        methods: {
            showNumber: (number, n) => (Array(n).join(0) + number).slice(-n)
        }
    })

    var Song = Vue.extend({
        template: loadTemplate("item-template"),
        data: function () {
            return {
                content: {}
            }
        },
        route: {
            data: function (transition) {
                //只有这里才能拿到路由参数
                console.log(transition);
                var id = parseInt(transition.to.params.id);
                if (!id) {
                    route.go("/home");
                    return;
                }
                return {
                    content: songList.find(s => s.id === id)
                }
            }
        }
    })

    var App = Vue.extend({})

    var router = new VueRouter()

    router.map({
        '/home': {
            name: 'home',
            component: Home
        },
        '/songs': {
            name: 'list',
            component: List
        },
        '/songs/:id': {
            name: 'item',
            component: Song
        }
    })

    router.redirect({"*": "/home"});

    router.start(App, '#app');

})(Vue)