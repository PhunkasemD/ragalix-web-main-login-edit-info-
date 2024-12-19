// ตรวจสอบว่าฟอร์มพร้อมทำงาน
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form');
    const errorMessage = document.querySelector('#error-message');

    // เพิ่ม Event Listener ให้ฟอร์ม
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // หยุดการรีเฟรชหน้าเว็บ

            const email = document.querySelector('#email').value.trim();
            const password = document.querySelector('#password').value.trim();

            if (!email || !password) {
                showError('Please fill in all fields.');
                return;
            }

            try {
                // ส่งข้อมูลไปยัง Backend ผ่าน API
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    // ล็อกอินสำเร็จ นำผู้ใช้ไปยังหน้า Dashboard
                    window.location.href = '/dashboard';
                } else {
                    // ล็อกอินไม่สำเร็จ แสดงข้อความผิดพลาด
                    showError(result.error || 'Login failed. Please try again.');
                }
            } catch (err) {
                showError('An unexpected error occurred. Please try again later.');
            }
        });
    }

    // ฟังก์ชันแสดงข้อความผิดพลาด
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }
});
