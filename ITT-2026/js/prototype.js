document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Prototype Mode");

    function getBgImgs(doc) {
        const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;
        return Array.from(
            Array.from(doc.querySelectorAll('*'))
            .reduce((collection, node) => {
                let prop = window.getComputedStyle(node, null).getPropertyValue('background-image');
                // match `url(...)`
                let match = srcChecker.exec(prop);
                if (match) {
                    collection.add(match[1]);
                    node.style.backgroundImage = `url('https://placehold.co/${node.clientWidth}x${node.clientHeight}.jpg')`;
                }
                return collection;
            }, new Set())
        );
    }

    getBgImgs(document);

    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].src = `https://placehold.co/${imgs[i].width}x${imgs[i].height}.jpg`;
        imgs[i].srcset = `https://placehold.co/${imgs[i].width}x${imgs[i].height}.jpg 1x, https://placehold.co/${imgs[i].width*2}x${imgs[i].height*2}.jpg 2x`;
    }

    var videos = document.getElementsByTagName("video");
    for (var i = 0; i < videos.length; i++) {
        videos[i].pause();
        videos[i].poster = `https://placehold.co/${videos[i].clientWidth}x${videos[i].clientHeight}.jpg?text=►`;

        // Remove all source elements
        var sources = videos[i].getElementsByTagName('source');
        while(sources.length > 0){
            videos[i].removeChild(sources[0]);
        }

        videos[i].load();
    }
});