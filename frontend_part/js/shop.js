var product = [{
    id:1,
        img: 'https://www.courtsmammouth.mu/96087-product_set/jbl-charge-5-black.jpg',
        name: 'JBL Charge 5',
        price: 1990,
        description: 'god Charge 5',
        type: 'jbl'
    }
    ,{
        id:2,
        img: 'https://m.media-amazon.com/images/I/61JdoSNoVzL.jpg',
        name: 'JBL Clip 4',
        price: 1990,
        description: 'god Clip 4',
        type: 'jbl'
}];


$(document).ready(() => {
    var html = '';
    for (let i = 0; i < product.length; i++) {
        html += `<div onclick="openProductDetail(${i})" class="product-items ${product[i].type}">
                    <img class="product-img" src="${product[i].img}" alt="">
                    <p style="font-size: 1.2vw;">${product[i].name}</p>
                    <p stlye="font-size: 1vw;">${ numberWithCommas(product[i].price) } THB</p>
                </div>`;
    }
    $("#productlist").html(html);

})
function toggleDropdown() {
    alert("Button clicked!");
  }

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function searchsomething(elem) {
    // console.log('#'+elem.id)
    var value = $('#'+elem.id).val()
    console.log(value)

    var html = '';
    for (let i = 0; i < product.length; i++) {
        if( product[i].name.includes(value) ) {
            html += `<div onclick="openProductDetail(${i})" class="product-items ${product[i].type}">
                    <img class="product-img" src="${product[i].img}" alt="">
                    <p style="font-size: 1.2vw;">${product[i].name}</p>
                    <p stlye="font-size: 1vw;">${ numberWithCommas(product[i].price) } THB</p>
                </div>`;
        }
    }
    if(html == '') {
        $("#productlist").html(`<p>Not found product</p>`);
    } else {
        $("#productlist").html(html);
    }

}


var productindex = 0;
function openProductDetail(index) {
    productindex = index;
    console.log(productindex)
    $("#modalDesc").css('display', 'flex')
    $("#mdd-img").attr('src', product[index].img);
    $("#mdd-name").text(product[index].name)
    $("#mdd-price").text( numberWithCommas(product[index].price) + ' THB')
    $("#mdd-desc").text(product[index].description)
}

function closeModal() {
    $(".modal").css('display','none')
}

var cart = [];
function addtocart() {
    var pass = true;

    for (let i = 0; i < cart.length; i++) {
        if( productindex == cart[i].index ) {
            console.log('found same product')
            cart[i].count++;
            pass = false;
        }
    }

    if(pass) {
        var obj = {
            index: productindex,
            id: product[productindex].id,
            name: product[productindex].name,
            price: product[productindex].price,
            img: product[productindex].img,
            count: 1
        };
        // console.log(obj)
        cart.push(obj)
    }
    console.log(cart)

    Swal.fire({
        icon: 'success',
        title: 'Add ' + product[productindex].name + ' to cart !'
    })
    $("#cartcount").css('display','flex').text(cart.length)
}

function openCart() {
    $('#modalCart').css('display','flex')
    rendercart();
}

function rendercart() {
    if(cart.length > 0) {
        var html = '';
        for (let i = 0; i < cart.length; i++) {
            html += `<div class="cartlist-items">
                        <div class="cartlist-left">
                            <img src="${cart[i].img}" alt="">
                            <div class="cartlist-detail">
                                <p style="font-size: 1.5vw;">${cart[i].name}</p>
                                <p style="font-size: 1.2vw;">${ numberWithCommas(cart[i].price * cart[i].count) } THB</p>
                            </div>
                        </div>
                        <div class="cartlist-right">
                            <p onclick="deinitems('-', ${i})" class="btnc">-</p>
                            <p id="countitems${i}" style="margin: 0 20px;">${cart[i].count}</p>
                            <p onclick="deinitems('+', ${i})" class="btnc">+</p>
                        </div>
                    </div>`;
        }
        $("#mycart").html(html)
    }
    else {
        $("#mycart").html(`<p>Not found product list</p>`)
    }
}

function deinitems(action, index) {
    if(action == '-') {
        if(cart[index].count > 0) {
            cart[index].count--;
            $("#countitems"+index).text(cart[index].count)

            if(cart[index].count <= 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Are you sure to delete?',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel'
                }).then((res) => {
                  if(res.isConfirmed) {
                     cart.splice(index, 1) 
                     console.log(cart)
                     rendercart();
                     $("#cartcount").css('display','flex').text(cart.length)
                     
                     if(cart.length <= 0) {
                        $("#cartcount").css('display','none')
                     }
                  }  
                  else {
                    cart[index].count++;
                    $("#countitems"+index).text(cart[index].count)
                    rendercart();
                  }
                })
            }
            rendercart();
        }
        
    }
    else if(action == '+') {
        cart[index].count++;
        $("#countitems"+index).text(cart[index].count)
        rendercart();
    }
}
function buy() {
    // สร้างตัวแปร html เพื่อแสดงรายละเอียดของสินค้าในตะกร้า
    let totalPrice = 0;
    let html = '<ul>'; // เริ่มต้นรายการสินค้า

    // วนลูปผ่านสินค้าทั้งหมดในตะกร้า
    for (let i = 0; i < cart.length; i++) {
        const itemTotal = cart[i].price * cart[i].count; // คำนวณราคาทั้งหมดของแต่ละรายการสินค้า
        totalPrice += itemTotal; // คำนวณราคาทั้งหมดของทุกสินค้าที่อยู่ในตะกร้า

        // สร้าง HTML ของสินค้าแต่ละรายการ
        html += `<li>${cart[i].name} x ${cart[i].count} = ${numberWithCommas(itemTotal)} THB</li>`;
    }
    html += '</ul>'; // ปิดรายการสินค้า

    // แสดง popup ขอบคุณพร้อมกับรายละเอียดของรายการสินค้าและราคาทั้งหมด
    Swal.fire({
        icon: 'success',
        title: 'Thank you for your purchase!',
        html: html + `<p><strong>Total Price: ${numberWithCommas(totalPrice)} THB</strong></p>`,  // แสดงราคาสุทธิ
        showCancelButton: true,  // แสดงปุ่ม Cancel
        confirmButtonText: 'Confirm',  // ปุ่มยืนยัน
        cancelButtonText: 'Cancel',  // ปุ่มยกเลิก
    }).then((res) => {
        if (res.isConfirmed) {
            // หากกดยืนยัน (Confirm)
            cart = [];  // ล้างข้อมูลในตะกร้า
            closeModal();  // ปิด modal ถ้ามี
            $("#cartcount").css('display','none');  // ซ่อนจำนวนสินค้าตะกร้า
            Swal.fire('Purchase confirmed!', 'Your items have been bought.', 'success'); // แจ้งเตือนการซื้อสำเร็จ
        } else if (res.isDismissed) {
            // หากกดปุ่ม Cancel
            Swal.fire('Purchase cancelled!', 'Your cart has not been cleared.', 'info'); // แจ้งเตือนการยกเลิก
        }
    });
}

// ฟังก์ชันช่วยในการแสดงจำนวนเงินในรูปแบบที่มีคอมมา (เช่น 1,000 หรือ 10,000)
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
