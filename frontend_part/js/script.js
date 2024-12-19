

// InterSectionObserver
document.addEventListener("DOMContentLoaded", () => {
    const fadeElements = document.querySelectorAll('.fade-up');
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1 // กำหนดให้เริ่มแสดงเมื่อ 10% ของ element เข้ามาใน viewport
    });
  
    fadeElements.forEach((el) => observer.observe(el));
  });
  


// const triggerOpen = document.querySelectorAll('[trigger-button]');
// const triggerClose = document.querySelectorAll('[close-button]');
// const overlay = document.querySelector('[data-overlay]');


// for (let i = 0; i < triggerOpen.length; i++){
    
//     let currentId = triggerOpen[i].dataset.target.split(/[ ,]+/),
//     targetEL = document.querySelector(`#${currentId}`)

    
//     const openData = function() {
//         targetEL.classList.remove('active');
//         overlay.classList.remove('active');
        
//     }
//     triggerOpen[i].addEventListener('click', function() {
//         targetEL.classList.add('active');
//         // overlay.classList.add('active');
//     })

//     targetEL.querySelector('[close-button]').addEventListener('click' , openData);
//     overlay.addEventListener('click', openData);
// }


//trigger + close + overlay ,Search
const triggerOpen = document.querySelectorAll('[trigger-button]');
  const triggerClose = document.querySelectorAll('[close-button]');
  const overlay = document.querySelector('[data-overlay]');

  for (let i = 0; i < triggerOpen.length; i++) {
    let currentId = triggerOpen[i].dataset.target.split(/[ ,]+/);
    let targetEL = document.querySelector(`#${currentId}`);

    const closeOverlay = function () {
      targetEL.classList.remove('active');
      overlay.classList.remove('active');
    };

    triggerOpen[i].addEventListener('click', function () {
      targetEL.classList.add('active');
      if (!targetEL.classList.contains('no-overlay')) {
        overlay.classList.add('active');
      }
    });

    targetEL.querySelector('[close-button]').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', closeOverlay);
    
  }



//mobile-menu submenu

const submenu = document.querySelectorAll('.child-trigger');
submenu.forEach((menu) => menu.addEventListener('click', function(e){
    e.preventDefault();
    submenu.forEach((item) => item != this ? item.closest('.has-child').classList.remove('active') : null);
    if(this.closest('.has-child').classList != 'active'){
        this.closest('.has-child').classList.toggle('active');
    }
})) 
   //mobile - head menu
   document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', () => {
        // จัดการปุ่ม
        document.querySelectorAll('.button').forEach(btn => btn.classList.remove('active')); // ลบ active จากทุกปุ่ม
        button.classList.add('active'); // เพิ่ม active ให้ปุ่มที่ถูกคลิก
        // จัดการ menu-section
        document.querySelectorAll('.menu-section').forEach(section => section.classList.remove('active')); // ซ่อนทุก section
        const targetId = button.getAttribute('data-target'); // ดึง id ของ section ที่ต้องการ
        document.getElementById(targetId).classList.add('active'); // แสดงเฉพาะ section ที่เกี่ยวข้อง
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.querySelector('.menu-bar .trigger'); // ปุ่มเปิดเมนู
    const closeTrigger = document.querySelector('#mobile-menu .close-trigger'); // ปุ่มปิดเมนู
    const overlay = document.getElementById('overlay'); // Overlay
    const mobileMenu = document.getElementById('mobile-menu'); // Mobile Menu

    // เปิดเมนู
    trigger.addEventListener('click', (e) => {
        e.preventDefault(); // ป้องกัน default ของลิงก์
        mobileMenu.classList.add('active'); // เพิ่ม active ให้เมนู
        overlay.classList.add('active'); // เพิ่ม active ให้ overlay
    });

    // ปิดเมนู
    const closeMenu = () => {
        mobileMenu.classList.remove('active'); // ลบ active จากเมนู
        overlay.classList.remove('active'); // ลบ active จาก overlay
    };

    closeTrigger.addEventListener('click', (e) => {
        e.preventDefault(); // ป้องกัน default ของลิงก์
        closeMenu();
    });

    // ปิดเมนูเมื่อคลิกที่ overlay
    overlay.addEventListener('click', closeMenu);
});


//carousel
const carousel = new Swiper('.carouselbox',{
    spaceBetween: 30,
    slidesPerView: 'auto',
    centeredSlides: true,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        481: {
            slidesPerView: 2,
            slidesPerGroup: 1,
            centeredSlides: false,
        },
        640: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            centeredSlides: false,
        },
        992: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            centeredSlides: false,
        }
    }
});


//usps
const usps = new Swiper('.uspsbox', {
    loop: true,
    spaceBetween: 30, // ระยะห่างระหว่าง slides
    slidesPerView: 1, // แสดงแค่ 1 ช่องเสมอ
    slidesPerGroup: 1, // เลื่อนทีละ 1 slide
    centeredSlides: true, // กำหนดให้ slide ตรงกลางอยู่ตรงกลาง

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});
