//รอเชื่อม Backend กับ Database
window.onload = async function() {
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');

    try {
        // ดึงข้อมูลผู้ใช้จาก API
        const response = await fetch('/api/user/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${document.cookie.split('token=')[1]}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const userData = await response.json();

        // อัปเดตข้อมูลในหน้าเว็บ
        document.getElementById('display-name').textContent = userData.name || 'Not Set';
        document.getElementById('display-email').textContent = userData.email || 'Not Set';
        document.getElementById('display-phone').textContent = userData.phone || 'Not Set';

        if (nameField) nameField.value = userData.name || '';
        if (emailField) emailField.value = userData.email || '';
        if (phoneField) phoneField.value = userData.phone || '';
    } catch (error) {
        console.error('Error loading user data:', error);
    }
};
