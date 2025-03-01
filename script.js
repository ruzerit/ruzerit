// ✅ 요소 가져오기
const galleryContainer = document.querySelector(".gallery-container");
const galleryItems = document.querySelectorAll(".gallery-item");
let isDown = false; // ✅ 변수를 미리 선언
let startX, startScrollLeft;

const videoModal = document.getElementById("modalVideoCheck");
const compCardModal = document.getElementById("modalCompCard");
const galleryModal = document.getElementById("galleryModal");
const galleryImage = document.getElementById("galleryImage");
const videoElement = document.querySelector("#modalVideoCheck video");

// ✅ 컴카드 & 비디오 모달 버튼 클릭 시 열기 (버튼 ID와 연결)
document.getElementById("compCardBtn").addEventListener("click", function () {
    openModal("modalCompCard");
});

document.getElementById("videoCheckBtn").addEventListener("click", function () {
    openModal("modalVideoCheck");
});

// ✅ 컴카드 & 비디오 모달 열기 함수 추가
function openModal(modalId) {
    let modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "flex";
        setTimeout(() => {
            modal.style.opacity = "1";
            modal.style.visibility = "visible";
        }, 50);
    }
}

// ✅ 컴카드 & 비디오 모달 닫기 함수 추가
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

// ✅ 초기 설정 (모달 숨김 및 비디오 자동 재생 방지)
document.addEventListener("DOMContentLoaded", function () {
    [videoModal, compCardModal, galleryModal].forEach(modal => {
        if (modal) {
            modal.style.display = "none";
            modal.style.opacity = "0";
            modal.style.visibility = "hidden";
        }
    });

    if (videoElement) {
        videoElement.removeAttribute("autoplay");
        videoElement.pause();
    }
    
window.onload = function () {
    setTimeout(() => {
        let initialIndex = 1;
        let containerCenter = galleryContainer.clientWidth / 2;
        let selectedItem = galleryItems[initialIndex];

        if (!selectedItem) {
            console.error("갤러리 아이템을 찾을 수 없음.");
            return;
        }

        console.log("초기 중앙 정렬:", selectedItem.offsetLeft);
        galleryContainer.scrollLeft = selectedItem.offsetLeft - containerCenter + selectedItem.offsetWidth / 2;
        updateCenterImage();
    }, 300);
};

// ✅ 중앙에 온 사진 강조 및 자동 정렬 유지
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

    // ✅ 강조 효과 적용
    galleryItems.forEach((item, index) => {
        item.classList.toggle("active", index === closestIndex);
    });

    // ✅ 자동 중앙 정렬
    let selectedItem = galleryItems[closestIndex];
    galleryContainer.scrollTo({
        left: selectedItem.offsetLeft - containerCenter + selectedItem.offsetWidth / 2,
        behavior: "smooth"
    });
}

// ✅ 가로 스크롤 이벤트 감지하여 중앙 정렬 유지
galleryContainer.addEventListener("scroll", function () {
    clearTimeout(window.scrollTimer);
    window.scrollTimer = setTimeout(updateCenterImage, 100);
});

// ✅ 드래그 스크롤 기능 수정
galleryContainer.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - galleryContainer.offsetLeft;
    startScrollLeft = galleryContainer.scrollLeft;
});

galleryContainer.addEventListener("mouseleave", () => {
    isDown = false;
});

galleryContainer.addEventListener("mouseup", () => {
    isDown = false;
});

galleryContainer.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    let x = e.pageX - galleryContainer.offsetLeft;
    let walk = (x - startX) * 2;
    galleryContainer.scrollLeft = startScrollLeft - walk;
});

// ✅ 모바일 터치 이벤트 추가
galleryContainer.addEventListener("touchstart", (e) => {
    isDown = true;
    startX = e.touches[0].pageX - galleryContainer.offsetLeft;
    startScrollLeft = galleryContainer.scrollLeft;
}, { passive: true });

galleryContainer.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    let x = e.touches[0].pageX - galleryContainer.offsetLeft;
    let walk = (x - startX) * 2;
    galleryContainer.scrollLeft = startScrollLeft - walk;
}, { passive: false });

galleryContainer.addEventListener("touchend", () => {
    isDown = false;
});

// ✅ 갤러리1 모달 열기
function openGalleryModal(imgElement) {
    let galleryModal = document.getElementById("galleryModal");
    let galleryImage = document.getElementById("galleryImage");

    if (galleryModal && galleryImage) {
        galleryImage.src = imgElement.src;
        galleryModal.style.display = "flex";
        setTimeout(() => {
            galleryModal.style.opacity = "1";
            galleryModal.style.visibility = "visible";
        }, 50);
    }
}

// ✅ 갤러리1 모달 닫기
function closeGalleryModal() {
    let galleryModal = document.getElementById("galleryModal");
    if (galleryModal) {
        galleryModal.style.opacity = "0";
        galleryModal.style.visibility = "hidden";
        setTimeout(() => {
            galleryModal.style.display = "none";
        }, 300);
    }
}

// ✅ ESC 키로 열린 모달 닫기
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        ["modalVideoCheck", "modalCompCard", "galleryModal", "gallery2Modal"].forEach(modalId => {
            let modal = document.getElementById(modalId);
            if (modal && window.getComputedStyle(modal).display !== "none") {
                closeModal(modalId);
            }
        });
    }
});

// ✅ 모달 바깥 클릭 시 닫기
document.addEventListener("DOMContentLoaded", function () {
    ["modalVideoCheck", "modalCompCard", "galleryModal", "gallery2Modal"].forEach(modalId => {
        let modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener("click", function (event) {
                if (event.target === modal) {
                    closeModal(modalId);
                }
            });
        }
    });
});

let gallery2Images = document.querySelectorAll(".gallery2-item img");
let currentGallery2Index = 0;

// ✅ 갤러리2 모달 열기
function openGallery2Modal(index) {
    currentGallery2Index = index;
    let imgElement = gallery2Images[index];
    let filename = imgElement.parentElement.dataset.filename;

    document.getElementById("gallery2Image").src = imgElement.src;
    document.getElementById("gallery2Filename").innerText = filename;
    document.getElementById("gallery2Modal").style.display = "flex";
}

// ✅ 갤러리2 모달 닫기
function closeGallery2Modal() {
    document.getElementById("gallery2Modal").style.display = "none";
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

// ✅ 모달 이미지 업데이트
function updateGallery2Modal() {
    let imgElement = gallery2Images[currentGallery2Index];
    let filename = imgElement.parentElement.dataset.filename;

    document.getElementById("gallery2Image").src = imgElement.src;
    document.getElementById("gallery2Filename").innerText = filename;
}

// ✅ 스크롤 시 갤러리2 이미지 나타나는 애니메이션 적용
document.addEventListener("scroll", function () {
    let gallery2Items = document.querySelectorAll(".gallery2-item");
    gallery2Items.forEach(item => {
        let rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            item.classList.add("visible");
        }
    });
});

