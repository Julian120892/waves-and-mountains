Vue.component("popupimage", {
    data: function () {
        return {
            heading: "pop up Component",
            url: "",
            title: "",
            description: "",
            username: "",
        };
    },
    template: "#popup-template",
    props: ["images", "id"],

    mounted: function () {
        console.log(this.id);
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
            });
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
        id: null,
    },
    mounted: function () {
        console.log("mounted ran");
        var self = this;
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

            axios.post("/upload", formData).then((res) => {
                this.images.unshift(res.data);
            });
        },
        openpopup: function (imgId) {
            this.id = imgId;
        },
        closingPopup: function () {
            console.log("close me");
            this.id = null;
        },
        getNextSetofImages: function (e) {
            e.preventDefault();
            console.log("button clicked");

            axios.get("/more").then((res) => {
                console.log(res.data);

                for (let i = 0; i < 10; i++) {
                    console.log(res.data[i]);
                    this.images.push(res.data[i]);
                }
            });
        },
    },
});
