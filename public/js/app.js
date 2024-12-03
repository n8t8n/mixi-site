const app = Vue.createApp({
  data() {
    return {
      images: [],
      isTableView: true,
      isGridView: false,
      totalImages: 0,
      totalSize: 0,
      selectedQuality: "0.5",
      theme: "dark",
    };
  },
  computed: {
    tableIcon() {
      return `
    <svg width="20" height="20" viewBox="0 0 0.375 0.375" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 .038A.04.04 0 0 1 .038 0H.1v.1H0zm0 .087v.213a.04.04 0 0 0 .038.037H.1v-.25zm.125.25h.213A.04.04 0 0 0 .376.337V.125H.125zM.375.1V.038A.04.04 0 0 0 .338 0H.125v.1z" fill="var(--bs-primary)"/>
    </svg> <span style="color:var(--bs-primary);font-weight: bold;">TABLE</span>`;
    },
    gridIcon() {
      return `
    <svg width="20px" height="20px" viewBox="0 0 0.375 0.375" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.038 0A0.038 0.038 0 0 0 0 0.038v0.1A0.038 0.038 0 0 0 0.038 0.175h0.1A0.038 0.038 0 0 0 0.175 0.138v-0.1A0.038 0.038 0 0 0 0.138 0z" fill="var(--bs-primary)"/>
    <path d="M0.238 0A0.038 0.038 0 0 0 0.2 0.038v0.1A0.038 0.038 0 0 0 0.238 0.175h0.1A0.038 0.038 0 0 0 0.375 0.138v-0.1A0.038 0.038 0 0 0 0.338 0z" fill="var(--bs-primary)"/>
    <path d="M0.038 0.2A0.038 0.038 0 0 0 0 0.238v0.1A0.038 0.038 0 0 0 0.038 0.375h0.1A0.038 0.038 0 0 0 0.175 0.338v-0.1A0.038 0.038 0 0 0 0.138 0.2z" fill="var(--bs-primary)"/>
    <path d="M0.238 0.2A0.038 0.038 0 0 0 0.2 0.238v0.1A0.038 0.038 0 0 0 0.238 0.375h0.1a0.038 0.038 0 0 0 0.038 -0.038v-0.1A0.038 0.038 0 0 0 0.338 0.2z" fill="var(--bs-primary)"/>
    </svg> <span style="color:var(--bs-primary);font-weight: bold;">GRID</span>`;
    },

    totalImages() {
      return this.images.length;
    },
    totalSize() {
      return this.images
        .reduce((acc, image) => acc + parseFloat(image.newSizeMB), 0)
        .toFixed(2);
    },
  },
  methods: {
    preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    handleFiles(files) {
      Array.from(files).forEach(this.uploadFile);
    },
    async uploadFile(file) {
      const webpImage = await this.convertToWebp(file);
      const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
      const newSizeMB = (
        this.getFileSizeFromDataUrl(webpImage) /
        1024 /
        1024
      ).toFixed(2);
      this.images.push({
        name: file.name,
        originalSize: file.size,
        webpImage,
        originalSizeMB,
        newSizeMB,
      });
    },
    async convertToWebp(file) {
      return new Promise(async (resolve) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const blob = await fetch(reader.result).then((r) => r.blob());
          const imageBitmap = await createImageBitmap(blob);
          const canvas = document.createElement("canvas");
          canvas.width = imageBitmap.width;
          canvas.height = imageBitmap.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(imageBitmap, 0, 0);
          canvas.toBlob(
            (blob) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            },
            `image/webp`, // Use selected format
            this.selectedQuality
          );
        };
        reader.readAsDataURL(file);
      });
    },
    getFileSizeFromDataUrl(dataUrl) {
      const blob = this.dataUrlToBlob(dataUrl);
      return blob.size;
    },
    dataUrlToBlob(dataUrl) {
      const parts = dataUrl.split(";base64,");
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: `image/${this.selectedFormat}` });
    },
    downloadImage(dataUrl, fileName) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName.replace(/\.[^/.]+$/, `.${this.selectedFormat}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    removeImage(index) {
      this.images.splice(index, 1);
    },
    toggleView() {
        this.isTableView = !this.isTableView;
        this.isGridView = !this.isGridView;
      },
      toggleTheme() {
        this.theme = this.theme === "dark" ? "light" : "dark";  
        document.body.setAttribute("data-theme", this.theme);
        localStorage.setItem('theme', this.theme);
      },
      removeInfoBar() {
        const infoBar = document.querySelector('.info-bar');
        const hideInfoBarTime = localStorage.getItem('hideInfoBar');
    
        if (hideInfoBarTime && Date.now() < parseInt(hideInfoBarTime, 10)) {
           infoBar.style.transform = 'translate(0%, -100%)';
        } else {
           const hideInfoBarTimeout = setTimeout(() => {
            infoBar.style.transform = 'translate(0%, -100%)';  
          }, 10000);
    
          // Hide the info-bar when clicked
          infoBar.addEventListener('click', () => {
            clearTimeout(hideInfoBarTimeout);
            infoBar.style.transform = 'translate(0%, -100%)'; 
             const hideInfoBarTime = Date.now() + 10 * 60 * 1000;
            localStorage.setItem('hideInfoBar', hideInfoBarTime);
          });
        }
      },
  },

  watch: {
    images: {
      handler(newImages) {
        this.totalImages = newImages.length;
        this.totalSize = newImages
          .reduce((total, image) => total + parseFloat(image.newSizeMB), 0)
          .toFixed(2);
      },
      deep: true,
    },
  },
  mounted() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/style.min.css";
    document.head.appendChild(link);
    this.removeInfoBar();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.theme = savedTheme;
      document.body.setAttribute("data-theme", this.theme);
    }

    const dropArea = document.getElementById("drop-area");

    document.body.addEventListener(
      "dragenter",
      (e) => {
        this.preventDefaults(e);
        dropArea.classList.add("show");
      },
      false
    );

    document.body.addEventListener("dragover", this.preventDefaults, false);

    document.body.addEventListener(
      "dragleave",
      (e) => {
        if (
          e.clientX <= 0 ||
          e.clientY <= 0 ||
          e.clientX >= window.innerWidth ||
          e.clientY >= window.innerHeight
        ) {
          dropArea.classList.remove("show");
        }
      },
      false
    );

    document.body.addEventListener(
      "drop",
      (e) => {
        this.preventDefaults(e);
        document.getElementById("drop-area").classList.remove("show");
        this.handleFiles(e.dataTransfer.files);
      },
      false
    );

    document.getElementById("file-input").addEventListener(
      "change",
      (e) => {
        this.handleFiles(e.target.files);
      },
      false
    );
  },
});

app.mount("#app");
