document.addEventListener('DOMContentLoaded', function() {
    const moduleInstances = document.querySelectorAll('.sr-cards-articles-03');

    function getQueryParam() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('articles03');
    }

    function updateURL(filter) {
        const cleanFilter = filter === '*' ? '' : filter;
        const urlParams = new URLSearchParams(window.location.search);
        if (cleanFilter) {
            urlParams.set('articles03', cleanFilter);
        } else {
            urlParams.delete('articles03');
        }
        const newURL = `${window.location.pathname}?${urlParams.toString()}`;
        history.pushState({}, '', newURL);
    }

    moduleInstances.forEach(module => {
        const tags = module.querySelectorAll('.blog-tags button');
        const blogListing = module.querySelector('.blog-listing');
        const articles = module.querySelectorAll('.blog-article');
        const postCount = parseInt(blogListing.dataset.postCount);
        const allButton = module.querySelector('[data-filter="*"]');

        let currentFilter = getQueryParam() || '*';
        if (!getQueryParam() && allButton) {
            tags.forEach(t => t.classList.remove('blog-tag--active'));
            allButton.classList.add('blog-tag--active');
            filterArticles('*');
        }
        else if (currentFilter !== '*') {
            const activeTag = Array.from(tags).find(tag => tag.dataset.filter === currentFilter);
            if (activeTag) {
                tags.forEach(t => t.classList.remove('blog-tag--active'));
                activeTag.classList.add('blog-tag--active');
                filterArticles(currentFilter);
            }
        }

        function filterArticles(filter) {
            let displayedCount = 0;
            
            articles.forEach(article => {
                const articleTags = article.dataset.filter.trim().split(' ');
                const shouldShow = filter === '*' || articleTags.includes(filter);
                
                if (shouldShow && displayedCount < postCount) {
                    article.classList.remove('d-none');
                    article.classList.add('d-block');
                    displayedCount++;
                } else {
                    article.classList.remove('d-block');
                    article.classList.add('d-none');
                }
            });
        }

        tags.forEach(tag => {
            tag.addEventListener('click', function() {
                const filter = this.dataset.filter;
                currentFilter = filter;
                
                tags.forEach(t => t.classList.remove('blog-tag--active'));
                this.classList.add('blog-tag--active');
                
                filterArticles(filter);
                updateURL(filter);  // Update URL when filter changes
            });
        });

        if (allButton) {
            allButton.addEventListener('click', function() {
                tags.forEach(t => t.classList.remove('blog-tag--active'));
                this.classList.add('blog-tag--active');
                currentFilter = '*';
                filterArticles('*');
                updateURL('*');  // Clear filter from URL
            });
        }
    });
});
