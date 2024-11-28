const { createApp } = Vue;

createApp({
  data() {
    return {
      //top profile
      username: document.querySelector('meta[name="author"]').content,
      profileImage: "media/1731029584866.jpg",

      //bubble msg
      bblMsg: "Este sitio web es un test de SEO en 8 días 🤔",
      showBblMsg: false,
      businessCategory: "Customer Success Specialist",
      description:
        "Full-Cycle Sales | B2B Sales | Senior Software Sales | SaaS",

      //location
      visitorLocation: null,
      fetchLocationEnabled: true,
      accordionOpen: false,
      moreInformation:
        " Gestioné más de 300 cuentas y generé ingresos constantes en startups. A la fecha, tengo más de 3 años de experiencia en SaaS, manejando el ciclo completo de ventas de software.  Mi enfoque customer-centric me llevó a Customer Success, donde combino mi expertise en ventas B2B. ",
      typedMoreInformation: "",
      typing: false,

      //grid post
      posts: [],
      //check post loaded / error
      loadingPosts: false,
      errorLoadingPosts: false,

      //open selected post
      currentPostId: null,
      showModal: false,

      // navigation tab areas
      tabs: [
        {
          name: "Posts",
          visible: true,
          icon: `<svg class="tab-icon" viewBox="0 0 0.48 0.48" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M.26.08v.14H.4V.08zm-.04 0H.08v.14h.14zM.26.4H.4V.26H.26zM.22.4V.26H.08V.4zM.08.04H.4a.04.04 0 0 1 .04.04V.4A.04.04 0 0 1 .4.44H.08A.04.04 0 0 1 .04.4V.08A.04.04 0 0 1 .08.04"/></svg>`,
        },
        {
          name: "Store",
          visible: true,
          icon: `<svg class="tab-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="m20.946 2 .994 17.89a2 2 0 0 1-1.886 2.107l-.111.003H4.057a2 2 0 0 1-2-2c0-.055 0-.055.003-.11L3.054 2zm-16 2-.889 16h15.886l-.889-16zM7 6h2v2.5c0 1.248 1.385 2.5 3 2.5s3-1.252 3-2.5V6h2v2.5c0 2.4-2.323 4.5-5 4.5s-5-2.1-5-4.5z"/></svg>`,
        },
        {
          name: "Podcast",
          visible: true,
          icon: `<svg class="tab-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 17h-2v-2h2v-2h2v2h2v2h-2v2h-2zM4 19v-2h10v2zm0-4v-2h10v2zm0-4V9h15v2zm0-4V5h15v2z"/></svg>`,
        },
        {
          name: "Calendar",
          visible: true,
          icon: `<svg class="tab-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M20 8V5h-2v1h-2V5H8v1H6V5H4v3zm0 2H4v10h16zm-2-7h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2V2h2v1h8V2h2zM9 14H7v-2h2zm4 0h-2v-2h2zm4 0h-2v-2h2zm-8 4H7v-2h2zm4 0h-2v-2h2z"/></svg>`,
        },
        {
          name: "Contacto",
          visible: true,
          icon: `<svg class="tab-icon"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14.802 6.445 8.696 12.55c-.405.358-.656.86-.696 1.318v2.135l2.064.002c.534-.038 1.031-.287 1.43-.743L17.558 9.2zm1.415-1.414 2.754 2.755.894-.894a.46.46 0 0 0 0-.653L17.76 4.135a.456.456 0 0 0-.647 0zM22 13v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7v2H4v16h16v-7zM17.437 2c.655 0 1.283.261 1.741.723l2.101 2.101a2.46 2.46 0 0 1 0 3.482l-8.321 8.318c-.699.805-1.69 1.3-2.823 1.378H6v-1l.003-3.215c.085-1.054.576-2.035 1.323-2.694l8.37-8.368A2.46 2.46 0 0 1 17.436 2"/></svg>`,
        },
      ],

      //navigation active area
      activeTab: "Posts",

      //store area: grid catalog
      catalog: [],
      loadingCatalog: true,
      errorLoadingCatalog: false,

      //store area: cart for catalog
      cart: [],

      //submit form
      formSubmitting: false,
      formSubmitted: localStorage.getItem("formSubmitted") === "true",
      formSubmitTimer: null,
      submitButtonText:
        localStorage.getItem("formSubmitted") === "true" ? "Enviado" : "Enviar",
    };
  },
  mounted() {
    document.addEventListener("DOMContentLoaded", () => {
      this.appReady();
      if (this.fetchLocationEnabled) {
        this.fetchLocation();
      }
    });
    this.fetchData();
    this.fetchCatalog();
    setTimeout(() => {
      const lastNotificationTime = localStorage.getItem("lastNotificationTime");
      const currentTime = Date.now();
      const tenMinutes = 10 * 60 * 1000;

      if (
        !lastNotificationTime ||
        currentTime - lastNotificationTime > tenMinutes
      ) {
        this.showBblMsg = true;
        const audio = new Audio("../media/sounds/notify.mp3");
        audio.play().catch((error) => {
          console.error("Error playing sound:", error);
        });
        localStorage.setItem("lastNotificationTime", currentTime);
      }
    }, 5500);
    window.showConfetti = this.showConfetti;
    window.addEventListener("hashchange", this.handleHashChange);

    // Set up a timer to fetch location every 10 minutes
    setInterval(() => {
      const lastLocationTime = localStorage.getItem("lastLocationTime");
      const currentTime = Date.now();
      const tenMinutes = 10 * 60 * 1000;

      if (
        this.fetchLocationEnabled &&
        (!lastLocationTime || currentTime - lastLocationTime > tenMinutes)
      ) {
        this.fetchLocation();
        localStorage.setItem("lastLocationTime", currentTime);
      }
    }, 1000 * 60); // Check every minute
  },
  computed: {
    limitedBblMsg() {
      return this.bblMsg.length > 50
        ? this.bblMsg.substring(0, 37) + "..."
        : this.bblMsg;
    },

    hasPosts() {
      return this.postsToShow.length > 0;
    },
    selectedPost() {
      return this.posts.find((post) => post.postId === this.currentPostId);
    },
    filteredTabs() {
      return this.tabs.filter((tab) => tab.visible);
    },
    postsToShow() {
      return this.activeTab === "Posts" ? this.posts : [];
    },
  },
  methods: {
    fetchData() {
      fetch("resources/db/posts.json")
        .then((response) => response.json())
        .then((posts) => {
          this.posts = posts.map((post) => ({
            postId: post.postId,
            postUrl: post.postUrl, // Ensure each post has a postUrl field
            imageUrl: post.imageUrl,
            title: post.title,
            postMsg: this.formatText(post.postMsg),
            date: this.formatDate(post.date),
          }));
          this.loadingPosts = false;
          this.handleQueryChange();
        })
        .catch((error) => {
          this.errorLoadingPosts = true;
          this.loadingPosts = false;
          console.error("Error loading posts:", error);
        });
    },
    handleQueryChange() {
      const path = window.location.pathname.substring(1); // Get the path without the leading slash

      if (path) {
        const foundPost = this.posts.find(
          (post) => post.postUrl === path // Change from postId to postUrl
        );
        if (foundPost) {
          this.currentPostId = foundPost.postId; // Set currentPostId to the found post's postId
          this.showModal = true;
        } else {
          this.closeModal();
        }
      } else {
        this.closeModal();
      }
    },

    handleHashChange() {
      const hash = window.location.hash.substring(1);
      const postId = hash ? parseInt(hash) : null;

      if (postId) {
        const foundPost = this.posts.find((post) => post.postId === postId);
        if (foundPost) {
          this.currentPostId = postId;
          this.showModal = true;
        } else {
          this.closeModal();
        }
      } else {
        this.closeModal();
      }
    },

    selectPost(postId) {
      this.currentPostId = postId;
      this.showModal = true;
      const postUrl = this.posts.find((post) => post.postId === postId).postUrl;
      window.history.pushState({}, "", `/${postUrl}`); // Change from postId to postUrl
      document.body.classList.add("no-scroll");
    },
    closeModal() {
      this.currentPostId = null;
      this.showModal = false;
      window.history.pushState({}, "", "/");
      document.body.classList.remove("no-scroll");
    },
    imageLoaded(event, type, id = null) {
      event.target.classList.add("loaded");
    },

    imageLoadedModal() {
      setTimeout(() => {
        const img = this.$refs.modalImage;
        if (img) {
          img.classList.add("loaded");
          const dateInfo = document.querySelector(".modal-date-info");
          if (dateInfo) dateInfo.style.display = "flex";
          document.body.classList.add("no-scroll");
        }
      }, 100);
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "America/Los_Angeles",
      };
      return date.toLocaleDateString("es-LA", options);
    },

    formatText(text) {
      text = text.replace(/\*(.*?)\*/g, "<b>$1</b>");
      text = text.replace(/_(.*?)_/g, "<i>$1</i>");
      text = text.replace(/`(.*?)`/g, "<pre>$1</pre>");
      text = text.replace(/\n/g, "<br>");
      return text;
    },

    fetchCatalog() {
      fetch("resources/db/catalog.json")
        .then((response) => response.json())
        .then((catalog) => {
          this.catalog = catalog.map((product) => ({
            ...product,
            description: this.formatText(product.description),
          }));
          this.loadingCatalog = false;
        })
        .catch((error) => {
          this.errorLoadingCatalog = true;
          this.loadingCatalog = false;
          console.error("Error loading catalog:", error);
        });
    },
    addToCart(product) {
      this.cart.push(product);
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
    },
    calculateTotal() {
      return this.cart.reduce((total, item) => total + item.price, 0);
    },
    initiateMercadoPago() {
      // MercadoPago integration (as before)
      const items = this.cart.map((item) => ({
        title: item.name,
        unit_price: item.price,
        quantity: 1,
      }));
      const preference = {
        items: items,
        external_reference: "your_order_id",
        back_urls: {
          success: "your_success_url",
          failure: "your_failure_url",
          pending: "your_pending_url",
        },
        auto_return: "approved",
      };

      const mp = new MercadoPago("YOUR_MERCADOPAGO_PUBLIC_KEY");
      mp.preferences
        .create(preference)
        .then((response) => {
          mp.checkout({ preference: { id: response.id } });
        })
        .catch((error) => {
          console.error("Error creating MercadoPago preference:", error);
        });
    },
    toggleAccordion() {
      this.accordionOpen = !this.accordionOpen;
      this.$refs.accordionContent.classList.toggle(
        "fadeIn",
        this.accordionOpen
      );
      if (this.accordionOpen) {
        this.startTyping();
      } else {
        this.typedMoreInformation = "";
        clearInterval(this.typingInterval);
        this.typing = false;
      }
    },

    startTyping() {
      this.typing = true;
      this.typedMoreInformation = "";
      let index = 0;
      this.typingInterval = setInterval(() => {
        if (index < this.moreInformation.length) {
          this.typedMoreInformation += this.moreInformation[index];
          index++;
        } else {
          clearInterval(this.typingInterval);
          this.typing = false;
        }
      }, 40);
    },
    fetchLocation() {
      fetch("https://ipapi.co/json/")
        .then((response) => response.json())
        .then((data) => {
          this.visitorLocation = {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country_name: data.country_name,
            latitude: data.latitude,
            longitude: data.longitude,
          };
          // console.log("Visitor location:", this.visitorLocation); // Log the location data
        })
        .catch((error) => {
          console.error("Error fetching visitor location:", error);
        });
    },

    appReady() {
      Promise.all([this.fetchData()])
        .then(() => {
          document.body.classList.add("ready");
          const lastConfettiTime = localStorage.getItem("lastConfettiTime");
          const currentTime = Date.now();
          const tenMinutes = 10 * 60 * 1000;

          if (
            !lastConfettiTime ||
            currentTime - lastConfettiTime > tenMinutes
          ) {
            this.showConfetti();
            localStorage.setItem("lastConfettiTime", currentTime);
          }
        })
        .catch((error) => {
          console.error("Error loading data:", error);
          document.body.classList.add("ready");
        });
    },

    submitForm(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      fetch(event.target.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          this.showConfetti();
          this.formSubmitting = false;
          this.formSubmitted = true;
          localStorage.setItem("formSubmitted", "true");
          this.submitButtonText = "Enviado";
          this.formSubmitTimer = setTimeout(() => {
            this.formSubmitted = false;
            localStorage.setItem("formSubmitted", "false");
            this.submitButtonText = "Enviar";
          }, 600000);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    showConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    },

    closebblMsg() {
      this.showBblMsg = false;
    },
  },
}).mount("#app");
