// ✅ 전역 변수 선언
let gallery2Images = [];
let currentGallery2Index = 0;

document.addEventListener("DOMContentLoaded", function () {
    // ✅ 요소 가져오기
    const galleryContainer = document.querySelector(".gallery-container");
    const galleryItems = document.querySelectorAll(".gallery-item");
    let isDown = false;
    let startX, startScrollLeft;

    const videoModal = document.getElementById("modalVideoCheck");
    const compCardModal = document.getElementById("modalCompCard");
    const galleryModal = document.getElementById("galleryModal");
    const galleryImage = document.getElementById("galleryImage");
    const videoElement = document.querySelector("#modalVideoCheck video");

    const gallery2Modal = document.getElementById("gallery2Modal");
    const gallery2Image = document.getElementById("gallery2Image");
    const gallery2Filename = document.getElementById("gallery2Filename");
    const gallery2Container = document.querySelector(".gallery2-container");

    // ✅ 갤러리2 이미지 가져오기
    gallery2Images = document.querySelectorAll(".gallery2-item img");

    // ✅ 갤러리2 초기 표시 설정
    if (gallery2Container) {
        gallery2Container.style.visibility = "visible";
        gallery2Container.style.opacity = "1";
    }

    // ✅ 다크 모드 설정
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function () {
            body.classList.toggle("dark-mode");
            localStorage.setItem("darkMode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
        });
    }

    // ✅ 컴카드 & 비디오 모달 버튼 클릭 시 열기
    const compCardBtn = document.getElementById("compCardBtn");
    const videoCheckBtn = document.getElementById("videoCheckBtn");

    if (compCardBtn) {
        compCardBtn.addEventListener("click", function () {
            openModal("modalCompCard");
        });
    }

    if (videoCheckBtn) {
        videoCheckBtn.addEventListener("click", function () {
            openModal("modalVideoCheck");
        });
    }

    // ✅ ESC 키 또는 외부 클릭 시 모달 닫기
    let modals = document.querySelectorAll(".modal");

    modals.forEach(modal => {
        modal.addEventListener("click", function (event) {
            if (!event.target.closest(".modal-content")) {
                closeModal(modal.id);
            }
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            modals.forEach(modal => closeModal(modal.id));
        }
    });

    // ✅ 모달 닫기 함수
    function closeModal(modalId) {
        let modal = document.getElementById(modalId);
        if (modal) {
            modal.style.opacity = "0";
            modal.style.visibility = "hidden";
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        }
    }

    // ✅ 갤러리1 모달 열기
    function openGalleryModal(imgElement) {
        if (!imgElement) {
            console.error("❌ 이미지 요소가 없습니다.");
            return;
        }

        if (galleryModal && galleryImage) {
            galleryImage.src = imgElement.src;
            openModal("galleryModal");
        }
    }

    // ✅ 갤러리1 모달 닫기
    function closeGalleryModal() {
        closeModal("galleryModal");
    }

    // ✅ 갤러리2 모달 열기
    function openGallery2Modal(index) {
        if (gallery2Images.length === 0) {
            console.error("❌ 갤러리2 이미지가 없습니다.");
            return;
        }

        currentGallery2Index = index;
        let imgElement = gallery2Images[index];

        if (!imgElement) {
            console.error("❌ 이미지 요소를 찾을 수 없습니다.");
            return;
        }

        let filename = imgElement.parentElement?.dataset?.filename || "파일명 없음";

        gallery2Image.src = imgElement.src;
        gallery2Filename.innerText = filename;
        openModal("gallery2Modal");
    }

    // ✅ 갤러리2 모달 닫기
    function closeGallery2Modal() {
        closeModal("gallery2Modal");
    }

    // ✅ 갤러리2 이미지 클릭 이벤트 추가
    gallery2Images.forEach((img, index) => {
        img.addEventListener("click", function () {
            openGallery2Modal(index);
        });
    });

    // ✅ 중앙 정렬 유지
    function updateCenterImage() {
        let containerCenter = galleryContainer.clientWidth / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        galleryItems.forEach((item, index) => {
            let itemCenter = item.offsetLeft + item.offsetWidth / 2 - galleryContainer.offsetLeft;
            let distance = Math.abs(itemCenter - (galleryContainer.scrollLeft + containerCenter));

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        galleryItems.forEach((item, index) => {
            item.classList.toggle("active", index === closestIndex);
        });

        let selectedItem = galleryItems[closestIndex];
        galleryContainer.scrollTo({
            left: selectedItem.offsetLeft - containerCenter + selectedItem.offsetWidth / 2,
            behavior: "smooth"
        });
    }

    if (galleryContainer) {
        galleryContainer.addEventListener("scroll", function () {
            clearTimeout(window.scrollTimer);
            window.scrollTimer = setTimeout(updateCenterImage, 100);
        });
    }

    // ✅ 이전 / 다음 이미지 보기
    function prevGallery2Image() {
        if (currentGallery2Index > 0) {
            currentGallery2Index--;
            updateGallery2Modal();
        }
    }

    function nextGallery2Image() {
        if (currentGallery2Index < gallery2Images.length - 1) {
            currentGallery2Index++;
            updateGallery2Modal();
        }
    }

    function updateGallery2Modal() {
        let imgElement = gallery2Images[currentGallery2Index];
        let filename = imgElement.parentElement.dataset.filename;

        gallery2Image.src = imgElement.src;
        gallery2Filename.innerText = filename;
    }

    // ✅ 스크롤 시 갤러리2 이미지 등장 애니메이션
    document.addEventListener("scroll", function () {
        let gallery2Items = document.querySelectorAll(".gallery2-item");
        gallery2Items.forEach(item => {
            let rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                item.classList.add("visible");
            }
        });
    });
});