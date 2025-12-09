// Script para probar actualización de perfil en producción
// Uso: node scripts/test-profile-update.js

const fetch = require('node-fetch');

const PRODUCTION_URL = 'https://tu-sitio.netlify.app'; // Cambia esto por tu URL
const USERNAME = 'rifas-el-randy'; // Cambia por tu username

async function testProfileUpdate() {
    console.log('🔍 Probando actualización de perfil...\n');

    // 1. Obtener perfil actual
    console.log('1️⃣ Obteniendo perfil actual...');
    const getResponse = await fetch(`${PRODUCTION_URL}/api/user/profile?username=${USERNAME}`);
    const currentProfile = await getResponse.json();
    console.log('✅ Perfil obtenido:', {
        name: currentProfile.name,
        hasPaymentCards: !!currentProfile.paymentCards,
        hasFaqs: !!currentProfile.faqs
    });

    // 2. Intentar actualizar con datos de prueba
    console.log('\n2️⃣ Intentando actualizar perfil...');
    const testData = {
        username: USERNAME,
        name: currentProfile.name,
        bio: currentProfile.bio,
        email: currentProfile.email,
        phone: currentProfile.phone,
        primaryColor: currentProfile.primaryColor || '#1dadfb',
        paymentCards: JSON.stringify([
            {
                bank: 'Banco de Prueba',
                accountNumber: '1234567890',
                accountHolder: 'Test User',
                cardType: 'Débito'
            }
        ]),
        faqs: JSON.stringify([
            {
                question: '¿Pregunta de prueba?',
                answer: 'Respuesta de prueba'
            }
        ])
    };

    const putResponse = await fetch(`${PRODUCTION_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
    });

    if (!putResponse.ok) {
        console.error('❌ Error al actualizar:', putResponse.status, putResponse.statusText);
        const error = await putResponse.text();
        console.error('Detalles:', error);
        return;
    }

    const updateResult = await putResponse.json();
    console.log('✅ Actualización exitosa');

    // 3. Verificar que los cambios se guardaron
    console.log('\n3️⃣ Verificando cambios...');
    const verifyResponse = await fetch(`${PRODUCTION_URL}/api/user/profile?username=${USERNAME}`);
    const updatedProfile = await verifyResponse.json();

    console.log('Resultado:', {
        paymentCards: updatedProfile.paymentCards ? JSON.parse(updatedProfile.paymentCards) : null,
        faqs: updatedProfile.faqs ? JSON.parse(updatedProfile.faqs) : null
    });

    if (updatedProfile.paymentCards && updatedProfile.faqs) {
        console.log('\n✅ ¡Los cambios se guardaron correctamente!');
    } else {
        console.log('\n❌ Los cambios NO se guardaron');
    }
}

testProfileUpdate().catch(console.error);
