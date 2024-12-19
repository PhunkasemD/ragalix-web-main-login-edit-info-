

//product image 
const thumbImage = new Swiper('.thumbnail-image', {

    // loop: true,
    direction: 'vertical',
    spaceBetween: 15, 
    slidesPerView: 1, 
    freeMode: true,
    watchSlidesProgress: true,
});
const mainImage = new Swiper('.main-image', {

    loop: true,
    autoHeight: true,
   
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    thumbs: {
        swiper: thumbImage,
    },

});