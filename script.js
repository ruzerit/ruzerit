// ✅ 전역 변수 선언
let currentGalleryIndex = 0;  
let currentGallery2Index = 0; 
let galleryModal, galleryImage, gallery2Modal, gallery2Image, gallery2Filename, galleryContainer, galleryItems, gallery2Images;

document.addEventListener("DOMContentLoaded", function () {
    // ✅ 요소 가져오기 및 전역 변수에 할당
    galleryModal = document.getElementById("galleryModal");
    galleryImage = document.getElementById("galleryImage");
    gallery2Modal = document.getElementById("gallery2Modal");
    gallery2Image = document.getElementById("gallery2Image");
    gallery2Filename = document.getElementById("gallery2Filename");

    galleryContainer = document.querySelector(".gallery-container");
    galleryItems = document.querySelectorAll(".gallery-item img");
    gallery2Images = document.querySelectorAll(".gallery2-item img");

    // ✅ 갤러리1 이미지 클릭 이벤트 (모달 열기)
    galleryItems.forEach((img) => {
        img.addEventListener("click", function () {
            openGalleryModal(this);
        });
    });

    // ✅ 갤러리2 이미지 클릭 이벤트
    gallery2Images.forEach((img, index) => {
        img.addEventListener("click", () => openGallery2Modal(index));
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

    gallery2Images = document.querySelectorAll(".gallery2-item img");
    gallery2Images.forEach((img, index) => {
        img.addEventListener("click", () => openGallery2Modal(index));
    }); 
        
    // ✅ 스크롤 시 갤러리2 이미지 등장 애니메이션
    function revealGallery2Items() {
        document.querySelectorAll(".gallery2-item").forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                item.classList.add("visible");
            }
        });
    }
    // 스크롤 시 및 초기 로딩 시 실행
    window.addEventListener("scroll", revealGallery2Items);
    revealGallery2Items();
 });    

    // 5. 갤러리 모달 내비게이션 버튼 이벤트 연결
    const prevBtn1 = document.querySelector("#galleryModal .prev");
    const nextBtn1 = document.querySelector("#galleryModal .next");
    if (prevBtn1) prevBtn1.addEventListener("click", prevGalleryImage);
    if (nextBtn1) nextBtn1.addEventListener("click", nextGalleryImage);
    const prevBtn2 = document.querySelector("#gallery2Modal .prev");
    const nextBtn2 = document.querySelector("#gallery2Modal .next");
    if (prevBtn2) prevBtn2.addEventListener("click", prevGallery2Image);
    if (nextBtn2) nextBtn2.addEventListener("click", nextGallery2Image);


// 4. 모달 닫기 버튼(X) 이벤트 공통 처리 (.close 클래스 대상으로)
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".modal .close").forEach((btn) => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            if (modal) closeModal(modal.id);
        });
    });
});

// 6. ESC 키 또는 배경 클릭 시 모달 닫기 (기존과 동일)
document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            // 열린 모든 모달 닫기
            document.querySelectorAll(".modal").forEach(modal => closeModal(modal.id));
        } else if (event.key === "ArrowRight") {
            // 오른쪽 화살표 -> 다음 이미지
            if (galleryModal.style.display !== "none") nextGalleryImage();
            if (gallery2Modal.style.display !== "none") nextGallery2Image();
        } else if (event.key === "ArrowLeft") {
            // 왼쪽 화살표 -> 이전 이미지
            if (galleryModal.style.display !== "none") prevGalleryImage();
            if (gallery2Modal.style.display !== "none") prevGallery2Image();
        }
    });

document.querySelectorAll(".modal").forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (!event.target.closest(".modal-content")) {
                closeModal(modal.id);
            }
        });
    });
});

// 7. 모달 열기/닫기 함수 (중복 제거 및 일관성 유지)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // 모달 표시: CSS 클래스 토글 또는 스타일 변경
        modal.style.display = "flex";
        modal.style.visibility = "visible";
        modal.style.opacity = "1";
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.transition = "opacity 0.3s ease";
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
        setTimeout(() => { modal.style.display = "none"; }, 300);
        // 동영상 모달인 경우 재생 일시정지하여 뒷소리 제거
        if (modalId === "modalVideoCheck" && modal.querySelector("video")) {
            modal.querySelector("video").pause();
        }
    }
}

// 8. 갤러리1 모달 열기 및 이미지 슬라이드 함수 추가
function openGalleryModal(imgElement) {
    const images = document.querySelectorAll(".gallery-item img");
    currentGalleryIndex = Array.from(images).indexOf(imgElement);  // 현재 이미지 인덱스 기록
    if (galleryImage && imgElement) {
        galleryImage.src = imgElement.src;
        openModal("galleryModal");
    }
}
function updateGalleryModal() {
    const images = document.querySelectorAll(".gallery-item img");
    galleryImage.src = images[currentGalleryIndex].src;
}
function prevGalleryImage() {
    if (currentGalleryIndex > 0) {
        currentGalleryIndex--;
        updateGalleryModal();
    }
}
function nextGalleryImage() {
    const images = document.querySelectorAll(".gallery-item img");
    if (currentGalleryIndex < images.length - 1) {
        currentGalleryIndex++;
        updateGalleryModal();
    }
}

// 9. 갤러리2 모달 내비게이션 (기존 함수 재사용, 이벤트 핸들러는 위에서 등록)
function updateGallery2Modal() {
    const imgEl = gallery2Images[currentGallery2Index];
    const filename = imgEl.parentElement.dataset.filename || "";
    
    if (gallery2Image && gallery2Filename) {
        gallery2Image.src = imgEl.src;
        gallery2Filename.innerText = filename;
    }
}

// ✅ 이전 이미지 보기
function prevGallery2Image() {
    if (currentGallery2Index > 0) {
        currentGallery2Index--;
        updateGallery2Modal();
    }
}

// ✅ 다음 이미지 보기
function nextGallery2Image() {
    if (currentGallery2Index < gallery2Images.length - 1) {
        currentGallery2Index++;
        updateGallery2Modal();
    }
}

let isDown = false;
let startX, startScrollLeft;

document.addEventListener("DOMContentLoaded", function () {
    if (galleryContainer) {
        galleryContainer.addEventListener("mousedown", (e) => {
            isDown = true;
            startX = e.pageX - galleryContainer.offsetLeft;
            startScrollLeft = galleryContainer.scrollLeft;
        });

        galleryContainer.addEventListener("mouseleave", () => isDown = false);
        galleryContainer.addEventListener("mouseup", () => isDown = false);

        galleryContainer.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            let x = e.pageX - galleryContainer.offsetLeft;
            let walk = (x - startX) * 2;
            galleryContainer.scrollLeft = startScrollLeft - walk;
        });
    }
});

    // ✅ 다크 모드 설정
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
    }

document.addEventListener("DOMContentLoaded", function () {
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
});