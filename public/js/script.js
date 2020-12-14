new Vue({
    el: "#main",
    data: {
        images: [],
    },
    mounted: function () {
        console.log("mounted ran");
        var self = this;
        axios
            .get("/images")
            .then(function (res) {
                console.log("hallo", res.data);
                self.images = res.data;
            })
            .catch(function (error) {
                console.log("error: ", error);
            });
    },
    methods: {
        someMethod: function (city) {
            console.log("function did run", city);
            //change value of name key
            this.name = city;
        },
    },
});
