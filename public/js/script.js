Vue.component("comment", {
    data: function () {
        return {
            username: "",
            comment: "",
            comments: [],
        };
    },
    props: ["id"],
    template: "#comments-template",
    mounted: function () {
        console.log("id", this.id);
        axios
            .get("/getComments", {
                params: {
                    id: this.id,
                    username: this.username,
                    comment: this.comment,
                },
            })
            .then((res) => {
                for (let i = 0; i < res.data.length; i++) {
                    this.comments.push(res.data[i]);
                }
            });
    },
    methods: {
        addCommentToDB: function (e) {
            console.log(this.id);

            e.preventDefault();
            console.log("clicked on submit comment");
            let obj = {
                username: this.username,
                comment: this.comment,
                id: this.id,
            };

            axios.post("/addComment", obj).then((res) => {
                console.log("add comment");
                this.comments.unshift(res.data);
                this.username = "";
                this.comment = "";
            });
        },
    },
});

Vue.component("popupimage", {
    data: function () {
        return {
            url: "",
            title: "",
            description: "",
            username: "",
        };
    },
    template: "#popup-template",
    props: ["images", "id"],

    mounted: function () {
        var self = this;
        console.log("id", this.id);
        axios
            .get("/image", {
                params: { id: this.id },
            })
            .then((result) => {
                self.title = result.data[0].title;
                self.url = result.data[0].url;
                self.description = result.data[0].description;
                self.username = result.data[0].username;
            });
    },
    watch: {
        id: function () {
            var self = this;
            axios
                .get("/image", {
                    params: { id: this.id },
                })
                .then((result) => {
                    self.title = result.data[0].title;
                    self.url = result.data[0].url;
                    self.description = result.data[0].description;
                    self.username = result.data[0].username;
                    //still need to figure out what to do when server does not have info bsp: #99 --> close modal
                })
                .catch(function (error) {
                    console.log("error in axios get", error);
                    self.$emit("close");
                });
        },
    },
    methods: {
        closePopup: function () {
            this.$emit("close");
        },
    },
});

new Vue({
    el: "#main",
    data: {
        images: [],
        title: "",
        description: "",
        username: "",
        image: null,
        id: location.hash.slice(1),
        add: null,
        lastimagenotonscreen: 1,
        lowId: null,
        pending: null,
    },
    mounted: function () {
        console.log("mounted ran");
        var self = this;

        addEventListener("hashchange", function () {
            console.log("location has updated", location.hash);
            self.id = location.hash.slice(1);
        });

        axios
            .get("/images")
            .then(function (res) {
                self.images = res.data;
            })
            .catch(function (error) {
                console.log("error: ", error);
            });
    },
    methods: {
        handleFileChange: function (e) {
            this.image = e.target.files[0];
        },
        upload: function (e) {
            console.log("clicked");
            e.preventDefault();
            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("image", this.image);
            this.add = null;
            this.pending = 1;

            axios.post("/upload", formData).then((res) => {
                this.images.unshift(res.data);
                this.pending = null;
                this.title = "";
                this.username = "";
                this.description = "";
            });
        },
        closingPopup: function () {
            console.log("close me");
            history.pushState({}, " ", "/");
            this.id = null;
        },
        getNextSetofImages: function (e) {
            e.preventDefault();
            let index = this.images.length;
            axios
                .get("/more", {
                    params: { id: this.images[index - 1].id },
                })
                .then((res) => {
                    if (this.images[index - 1].id == this.lowId) {
                        console.log("the same");
                        this.lastimagenotonscreen = null;
                    } else {
                        for (let i = 0; i < res.data.length; i++) {
                            this.images.push(res.data[i]);
                        }
                        this.lowId = res.data[0].lowestId;
                    }
                })
                .catch((err) => {
                    console.log("error in get /more", err);
                });
        },
        showUpload: function () {
            this.add = 1;
        },
        hideUpload: function () {
            this.add = null;
        },
    },
});
