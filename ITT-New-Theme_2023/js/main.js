(function () {
  // Variables
  var nav = document.querySelector('.header__navigation');
  var langSwitcher = document.querySelector('.header__language-switcher');
  var search = document.querySelector('.header__search');
  var allToggles = document.querySelectorAll('.header--toggle');
  var navToggle = document.querySelector('.header__navigation--toggle');
  var langToggle = document.querySelector('.header__language-switcher--toggle');
  var searchToggle = document.querySelector('.header__search--toggle');
  var closeToggle = document.querySelector('.header__close--toggle');
  var allElements = document.querySelectorAll(
    '.header--element, .header--toggle'
  );
  var emailGlobalUnsub = document.querySelector('input[name="globalunsub"]');

  document.addEventListener('click',function(e){
    // Hamburger menu
    if(e.target.classList.contains('hamburger-toggle')){
      e.target.children[0].classList.toggle('active');
    }    
  })

  
// Nav tabs redirection
document.getElementById("cd-tab").onclick = function () {
  location.href = "https://www.intimetec.com/core-development";
};
  document.getElementById("ai-tab").onclick = function () {
  location.href = "https://www.intimetec.com/artificial-intelligence";
};
  document.getElementById("dt-tab").onclick = function () {
  location.href = "https://www.intimetec.com/data";
};
document.getElementById("qa-tab").onclick = function () {
  location.href = "https://www.intimetec.com/qa-ta";
};
document.getElementById("ux-tab").onclick = function () {
  location.href = "https://www.intimetec.com/ux-ui";
};
document.getElementById("cs-tab").onclick = function () {
  location.href = "https://www.intimetec.com/cybersecurity";
};
document.getElementById("business-tab").onclick = function () {
  location.href = "https://www.intimetec.com/business-services";
};

  
document.getElementById("story-tab").onclick = function () {
  location.href = "https://www.intimetec.com/our-story";
};
  document.getElementById("product-tab").onclick = function () {
  location.href = "https://www.intimetec.com/our-products";
};
document.getElementById("cert-tab").onclick = function () {
  location.href = "https://www.intimetec.com/certifications";
};
document.getElementById("careers-tab").onclick = function () {
  location.href = "https://www.intimetec.com/careers";
};  
  
  
document.getElementById("books-tab").onclick = function () {
  location.href = "https://www.intimetec.com/books";
};
document.getElementById("downloads-tab").onclick = function () {
  location.href = "https://www.intimetec.com/digital-downloads";
};
document.getElementById("blogs-tab").onclick = function () {
  location.href = "https://blog.intimetec.com/";
};
// Nav tabs redirection ends


  // Function for executing code on document ready
  function domReady(callback) {
    if (['interactive', 'complete'].indexOf(document.readyState) >= 0) {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  // Function for toggling mobile navigation
  function toggleNav() {
    allToggles.forEach(function (toggle) {
      toggle.classList.toggle('hide');
    });

    nav.classList.toggle('open');
    navToggle.classList.toggle('open');

    closeToggle.classList.toggle('show');
  }

  // Function for toggling mobile language selector
  function toggleLang() {
    allToggles.forEach(function (toggle) {
      toggle.classList.toggle('hide');
    });

    langSwitcher.classList.toggle('open');
    langToggle.classList.toggle('open');

    closeToggle.classList.toggle('show');
  }

  // Function for toggling mobile search field
  function toggleSearch() {
    allToggles.forEach(function (toggle) {
      toggle.classList.toggle('hide');
    });

    search.classList.toggle('open');
    searchToggle.classList.toggle('open');

    closeToggle.classList.toggle('show');
  }

  // Function for the header close option on mobile
  function closeAll() {
    allElements.forEach(function (element) {
      element.classList.remove('hide', 'open');
    });

    closeToggle.classList.remove('show');
  }

  // Function to disable the other checkbox inputs on the email subscription system page template
  function toggleDisabled() {
    var emailSubItem = document.querySelectorAll('#email-prefs-form .item');

    emailSubItem.forEach(function (item) {
      var emailSubItemInput = item.querySelector('input');

      if (emailGlobalUnsub.checked) {
        item.classList.add('disabled');
        emailSubItemInput.setAttribute('disabled', 'disabled');
        emailSubItemInput.checked = false;
      } else {
        item.classList.remove('disabled');
        emailSubItemInput.removeAttribute('disabled');
      }
    });
  }

  // Execute JavaScript on document ready
  domReady(function () {
    if (!document.body) {
      return;
    } else {
      // Function dependent on language switcher
      if (langSwitcher) {
        langToggle.addEventListener('click', toggleLang);
      }

      // Function dependent on navigation
      if (navToggle) {
        navToggle.addEventListener('click', toggleNav);
      }

      // Function dependent on search field
      if (searchToggle) {
        searchToggle.addEventListener('click', toggleSearch);
      }

      // Function dependent on close toggle
      if (closeToggle) {
        closeToggle.addEventListener('click', closeAll);
      }

      // Function dependent on email unsubscribe from all input
      if (emailGlobalUnsub) {
        emailGlobalUnsub.addEventListener('change', toggleDisabled);
      }     
    }
  });
  
//   scroll to section js
           document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('scrollToValueSection').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default jump-to behavior
            
            const section = document.querySelector(this.getAttribute('href'));
            section.scrollIntoView({
                behavior: 'smooth' // Smooth scrolling behavior
            });
        });
    }); 

//Inner Tabs Hover Effect
const cdTab = document.querySelector("#cd-tab");
const aiTab = document.querySelector("#ai-tab");
const dtTab = document.querySelector("#dt-tab");
const qaTab = document.querySelector("#qa-tab");
const uxTab = document.querySelector("#ux-tab");
const csTab = document.querySelector("#cs-tab");
const businessTab = document.querySelector("#business-tab");

const storyTab = document.querySelector("#story-tab");
const productTab = document.querySelector("#product-tab");
const certTab = document.querySelector("#cert-tab");
const careerTab = document.querySelector("#careers-tab");

const storyTabContent = document.querySelector("#story-tab-pane");
const productTabContent = document.querySelector("#product-tab-pane");
const certTabContent = document.querySelector("#cert-tab-pane");
const careerTabContent = document.querySelector("#careers-tab-pane");

const cdTabContent = document.querySelector("#cd-tab-pane");
const aiTabContent = document.querySelector("#ai-tab-pane");
const dtTabContent = document.querySelector("#dt-tab-pane");
const qaTabContent = document.querySelector("#qa-tab-pane");
const uxTabContent = document.querySelector("#ux-tab-pane");
const csTabContent = document.querySelector("#cs-tab-pane");
const businessTabContent = document.querySelector("#business-tab-pane");



const ourServicesTabs = [
  { tab: cdTab, content: cdTabContent },
  { tab: aiTab, content: aiTabContent },
  { tab: dtTab, content: dtTabContent },
  { tab: qaTab, content: qaTabContent },
  { tab: uxTab, content: uxTabContent },
  { tab: csTab, content: csTabContent },
  { tab: businessTab, content: businessTabContent },
];

ourServicesTabs.forEach((currentTab, index) => {
  currentTab.tab.addEventListener("mouseover", () => {
    ourServicesTabs.forEach(tab => {
      tab.tab.classList.remove("active");
      tab.tab.setAttribute('aria-selected', false);
      tab.content.classList.remove("active", "show");
    });

    currentTab.tab.setAttribute('aria-selected', true);
    currentTab.tab.classList.add("active");
    currentTab.content.classList.add("active", "show");
  });
});


const aboutUsTabs = [
  { tab: storyTab, content: storyTabContent },
  { tab: productTab, content: productTabContent },
  { tab: certTab, content: certTabContent },
  { tab: careerTab, content: careerTabContent },
];

function handleTabMouseover(selectedTab) {
  aboutUsTabs.forEach((tabSet) => {
    if (tabSet.tab === selectedTab) {
      tabSet.tab.setAttribute('aria-selected', true);
      tabSet.tab.classList.add('active');
      tabSet.content.classList.add('active', 'show');
    } else {
      tabSet.tab.classList.remove('active');
      tabSet.tab.setAttribute('aria-selected', false);
      tabSet.content.classList.remove('active', 'show');
    }
  });
}

aboutUsTabs.forEach((tabSet) => {
  tabSet.tab.addEventListener('mouseover', () => {
    handleTabMouseover(tabSet.tab);
  });
});
//Inner Tabs Hover Effect Ends
  
})();


// $(function() {
//   $('.nav-item.dropdown.dropdown-mega.a-our-services').mouseenter(function() {
//     $('.dropdown-menu.dd-our-service').addClass("show");
//   })
//   .mouseleave(function () {
//     $('.dropdown-menu.dd-our-service').removeClass("show");
//   });
// });

// $(function() {
//   $('.nav-item.dropdown.dropdown-mega.a-about-us').mouseenter(function() {
//     $('.dropdown-menu.dd-about-us').addClass("show");
//   })
//   .mouseleave(function () {
//     $('.dropdown-menu.dd-about-us').removeClass("show");
//   });
// });

// $(function() {
//   $('.nav-item.dropdown.dropdown-mega.a-resources').mouseenter(function() {
//     $('.dropdown-menu.dd-resources').addClass("show");
//   })
//   .mouseleave(function () {
//     $('.dropdown-menu.dd-resources').removeClass("show");
//   });
// });



if(window.innerWidth>1199){
   $(function() {
  $('.nav-item.dropdown.dropdown-mega.a-our-services').mouseenter(function() {
    $('.dropdown-menu.dd-our-service').addClass("show");
  })
  .mouseleave(function () {
    $('.dropdown-menu.dd-our-service').removeClass("show");
  });
});

$(function() {
  $('.nav-item.dropdown.dropdown-mega.a-about-us').mouseenter(function() {
    $('.dropdown-menu.dd-about-us').addClass("show");
  })
  .mouseleave(function () {
    $('.dropdown-menu.dd-about-us').removeClass("show");
  });
});

$(function() {
  $('.nav-item.dropdown.dropdown-mega.a-resources').mouseenter(function() {
    $('.dropdown-menu.dd-resources').addClass("show");
  })
  .mouseleave(function () {
    $('.dropdown-menu.dd-resources').removeClass("show");
  });
});
}
