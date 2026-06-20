const formatDateFR = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
};

const dateRange = (ev) => {
    const d1 = formatDateFR(ev.date_debut);
    if (!ev.date_fin || ev.date_debut === ev.date_fin) return d1;
    return `Du ${d1} au ${formatDateFR(ev.date_fin)}`;
};

const qrSrc = (ev) => {
    const code = ev.code_public || ev.code_unique;
    if (!code) return null;
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const url = encodeURIComponent(`${base}/events/${code}`);
    return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${url}`;
};

const defaultBusiness = {
    name: 'Mon Commerce',
    tagline: '',
    social: '',
    phone: '',
};

const contactLine = (business) => {
    const parts = [];
    if (business.social) parts.push(business.social);
    if (business.phone) parts.push(`📞 ${business.phone}`);
    return parts.join(' &nbsp;•&nbsp; ');
};

// ─── Template 1 : Prestige ───────────────────────────────────────────────────
function generatePrestige(ev, business = defaultBusiness) {
    business = { ...defaultBusiness, ...business };
    const date = dateRange(ev);
    const src  = qrSrc(ev);
    const FOOTER_COLOR = '#0a1f12';

    return `<div style="width:1080px;height:1080px;display:flex;font-family:Georgia,serif;overflow:hidden;">

        <!-- Panel gauche 45% -->
        <div style="width:560px;min-width:560px;height:1080px;background:linear-gradient(180deg,#1a3f2c 0%,#2a5a3a 100%);display:flex;flex-direction:column;">
            <!-- Photo réduite -->
            <div style="flex:1;overflow:hidden;position:relative;display:flex;align-items:flex-start;justify-content:flex-end;">
                <img src="/images/modele.jpg" style="height:100%;width:auto;display:block;" alt="">
                <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(to bottom,rgba(26,63,44,0.15) 45%,rgba(26,63,44,0.85) 100%);"></div>
            </div>
            <!-- Footer gauche même hauteur que droite -->
            <div style="height:70px;background:${FOOTER_COLOR};flex-shrink:0;display:flex;align-items:center;padding:0 30px;box-sizing:border-box;">
                <p style="font-size:14px;color:#aad4b8;margin:0;font-family:Arial,sans-serif;">${contactLine(business)}</p>
            </div>
        </div>

        <!-- Panel droit 55% -->
        <div style="flex:1;height:1080px;background:#FEFDF6;display:flex;flex-direction:column;padding:0 50px;box-sizing:border-box;position:relative;">

            <!-- Logo tout en haut, collé au bord -->
            <div style="padding-top:20px;flex-shrink:0;">
                <img src="/images/logo.jpg" style="width:170px;height:170px;object-fit:contain;display:block;" alt="Logo ${business.name}">
            </div>

            <!-- 3 lignes du texte, centrées -->
            <div style="flex-shrink:0;margin-top:10px;text-align:center;">
                <p style="font-size:20px;color:#888;letter-spacing:6px;text-transform:uppercase;margin:0 0 10px;font-family:Arial,sans-serif;">OFFICIEL</p>
                <p style="font-size:60px;font-weight:700;color:#3A3F43;letter-spacing:1px;margin:0 0 10px;font-family:Arial,sans-serif;">${business.name}</p>
                <p style="font-size:24px;color:#aaa;letter-spacing:2px;margin:0;font-family:Arial,sans-serif;">${business.tagline}</p>
            </div>

            <!-- Event : titre et date, espace augmenté au dessus -->
            <div style="margin-top:100px;flex-shrink:0;">
                <h2 style="font-size:42px;font-weight:700;color:#3A3F43;line-height:1.25;margin:0 0 18px;word-wrap:break-word;overflow-wrap:break-word;font-family:Georgia,serif;">${ev.nom}</h2>
                <p style="font-size:20px;color:#DC5F00;font-weight:600;margin:0;font-family:Arial,sans-serif;">✦ ${date}</p>
            </div>

            <!-- Card verte réduite : citation à gauche + QR à droite -->
            <div style="margin-top:auto;margin-bottom:20px;background:#1a3f2c;border-radius:16px;padding:18px 22px;flex-shrink:0;display:flex;align-items:center;gap:20px;">
                <!-- Citation centrée à gauche -->
                <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
                    <p style="color:rgba(255,255,255,0.7);font-size:20px;font-style:italic;line-height:1.7;margin:0 0 10px;font-family:Georgia,serif;text-align:center;">"La beauté des Antilles<br>sublimée en 3D"</p>
                    <div style="width:40px;height:1px;background:#DC5F00;margin:0 auto;"></div>
                </div>
                <!-- QR à droite -->
                <div style="background:#ffffff;border:1px solid #e8e0d0;border-radius:14px;padding:12px;display:inline-flex;flex-shrink:0;">
                    <img src="${src}" style="width:140px;height:140px;display:block;" crossorigin="anonymous" alt="QR">
                </div>
            </div>

            <!-- Footer droit -->
            <div style="height:70px;background:${FOOTER_COLOR};margin-left:-50px;margin-right:-50px;display:flex;align-items:center;padding:0 50px;box-sizing:border-box;flex-shrink:0;justify-content:flex-end;">
                <p style="font-size:18px;color:#aad4b8;margin:0;font-family:Arial,sans-serif;">📍 ${ev.lieu || ''}</p>
            </div>
        </div>
    </div>`;
}

// ─── Template 2 : Alpinia ────────────────────────────────────────────────────
// Copie de Simple avec bijoux.png
function generateAlpinia(ev, business = defaultBusiness) {
    business = { ...defaultBusiness, ...business };
    const date = dateRange(ev);
    const src  = qrSrc(ev);

    const lieuLine = ev.lieu
        ? `<p style="font-size:20px;color:#666C7B;margin:10px 0 0;font-family:Arial,sans-serif;">📍 ${ev.lieu}</p>`
        : '';

    const qrBlock = src
        ? `<img src="${src}" style="width:180px;height:180px;display:block;margin:0 auto 14px;" crossorigin="anonymous" alt="QR">
           <p style="font-size:14px;font-weight:700;color:#3A3F43;text-align:center;margin:0;letter-spacing:1px;font-family:Arial,sans-serif;">Scannez-moi !</p>`
        : `<p style="font-size:13px;color:#666C7B;text-align:center;margin:0;font-family:Arial,sans-serif;">Pas de QR disponible</p>`;

    return `<div style="width:1080px;height:1080px;background:#eeeeee;padding:40px;box-sizing:border-box;font-family:Arial,sans-serif;">
        <div style="width:100%;height:100%;background:#ffffff;border-radius:40px;padding:30px 50px 50px;box-sizing:border-box;display:flex;flex-direction:column;overflow:hidden;">
            <div style="display:flex;align-items:flex-start;gap:24px;flex-shrink:0;">
                <img src="/images/logo.jpg" style="width:200px;height:200px;object-fit:contain;flex-shrink:0;" alt="Logo ${business.name}">
                <div style="flex:1;text-align:center;padding-top:8px;">
                    <p style="font-size:130px;font-weight:900;color:#3A3F43;line-height:0.9;margin:50px 0 20px;font-family:Georgia,serif;">${business.name}</p>
                    <p style="font-size:18px;color:#666C7B;letter-spacing:5px;text-transform:uppercase;margin:20px 0 16px;font-family:Arial,sans-serif;">${business.tagline}</p>
                    <div style="width:80px;height:4px;background:#DC5F00;margin:0 auto;border-radius:2px;"></div>
                </div>
            </div>
            <div style="text-align:center;margin-top:64px;margin-bottom:24px;flex-shrink:0;">
                <h2 style="font-size:64px;font-weight:900;color:#3A3F43;line-height:1.1;margin:0 0 14px;word-wrap:break-word;overflow-wrap:break-word;">${ev.nom}</h2>
                <p style="font-size:24px;color:#DC5F00;font-weight:700;margin:0;">${date}</p>
                ${lieuLine}
            </div>
            <div style="height:320px;display:flex;gap:20px;flex-shrink:0;margin-top:40px;">
                <div style="flex:0.67;border-radius:20px;overflow:hidden;background-image:url('/images/bijoux.png');background-size:auto 100%;background-position:center center;background-repeat:no-repeat;"></div>
                <div style="flex:1.5;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#EEEEEE;border-radius:20px;padding:24px;box-sizing:border-box;">
                    ${qrBlock}
                </div>
            </div>
            <div style="margin-top:24px;padding-top:20px;border-top:2px solid #EEEEEE;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <p style="font-size:15px;color:#666C7B;margin:0;text-align:center;">${contactLine(business)}</p>
            </div>
        </div>
    </div>`;
}

// ─── Template 3 : Simple ─────────────────────────────────────────────────────
function generateSimple(ev, business = defaultBusiness) {
    business = { ...defaultBusiness, ...business };
    const date = dateRange(ev);
    const src  = qrSrc(ev);

    const lieuLine = ev.lieu
        ? `<p style="font-size:20px;color:#666C7B;margin:10px 0 0;font-family:Arial,sans-serif;">📍 ${ev.lieu}</p>`
        : '';

    const qrBlock = src
        ? `<img src="${src}" style="width:180px;height:180px;display:block;margin:0 auto 14px;" crossorigin="anonymous" alt="QR">
           <p style="font-size:14px;font-weight:700;color:#3A3F43;text-align:center;margin:0;letter-spacing:1px;font-family:Arial,sans-serif;">Scannez-moi !</p>`
        : `<p style="font-size:13px;color:#666C7B;text-align:center;margin:0;font-family:Arial,sans-serif;">Pas de QR disponible</p>`;

    return `<div style="width:1080px;height:1080px;background:#eeeeee;padding:40px;box-sizing:border-box;font-family:Arial,sans-serif;">
        <div style="width:100%;height:100%;background:#ffffff;border-radius:40px;padding:30px 50px 50px;box-sizing:border-box;display:flex;flex-direction:column;overflow:hidden;">

            <!-- Header : logo haut gauche + titre/sous-titre centré à droite -->
            <div style="display:flex;align-items:flex-start;gap:24px;flex-shrink:0;">
                <img src="/images/logo.jpg" style="width:200px;height:200px;object-fit:contain;flex-shrink:0;" alt="Logo ${business.name}">
                <div style="flex:1;text-align:center;padding-top:8px;">
                    <p style="font-size:130px;font-weight:900;color:#3A3F43;line-height:0.9;margin:50px 0 56px;font-family:Georgia,serif;">${business.name}</p>
                    <p style="font-size:18px;color:#666C7B;letter-spacing:5px;text-transform:uppercase;margin:20px 0 16px;font-family:Arial,sans-serif;">${business.tagline}</p>
                    <div style="width:80px;height:4px;background:#DC5F00;margin:0 auto;border-radius:2px;"></div>
                </div>
            </div>

            <!-- Section événement -->
            <div style="text-align:center;margin-top:44px;margin-bottom:24px;flex-shrink:0;">
                <h2 style="font-size:64px;font-weight:900;color:#3A3F43;line-height:1.1;margin:0 0 14px;word-wrap:break-word;overflow-wrap:break-word;">${ev.nom}</h2>
                <p style="font-size:24px;color:#DC5F00;font-weight:700;margin:0;">${date}</p>
                ${lieuLine}
            </div>

            <!-- Section media : photo ratio 2:3 (50%) + card QR (50%) -->
            <div style="height:290px;display:flex;gap:20px;flex-shrink:0;margin-top:40px;">
                <div style="flex:1.5;border-radius:20px;overflow:hidden;background-image:url('/images/modele.jpg');background-size:135%;background-position:78% 55%;background-repeat:no-repeat;"></div>
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#EEEEEE;border-radius:20px;padding:24px;box-sizing:border-box;">
                    ${qrBlock}
                </div>
            </div>

            <!-- Footer -->
            <div style="margin-top:24px;padding-top:20px;border-top:2px solid #EEEEEE;display:flex;align-items:center;flex-shrink:0;">
                <p style="font-size:15px;color:#666C7B;margin:0;">${contactLine(business)}</p>
            </div>
        </div>
    </div>`;
}

// ─── Template 4 : Géo ────────────────────────────────────────────────────────
function generateGeo(ev, business = defaultBusiness) {
    business = { ...defaultBusiness, ...business };
    const date = dateRange(ev);
    const src  = qrSrc(ev);

    const qrTopRight = src
        ? `<div style="background:#fff;border-radius:12px;padding:10px;flex-shrink:0;box-shadow:0 4px 16px rgba(0,0,0,0.15);">
               <img src="${src}" style="width:100px;height:100px;display:block;" crossorigin="anonymous" alt="QR">
           </div>`
        : '';

    const addressBox = ev.lieu
        ? `<p style="font-size:14px;color:#DC5F00;font-weight:700;margin:0;text-align:center;font-family:Arial,sans-serif;">📍 ${ev.lieu}</p>`
        : '';

    const qrBottomRight = src
        ? `<img src="${src}" style="width:180px;height:180px;display:block;" crossorigin="anonymous" alt="QR">
           <p style="font-size:11px;color:#666C7B;margin:0;text-align:center;font-family:Arial,sans-serif;">Scanner le catalogue</p>`
        : '';

    return `<div style="width:1080px;height:1080px;background:#ffffff;font-family:Arial,sans-serif;overflow:hidden;position:relative;">

        <!-- Bande orange diagonale -->
        <div style="position:absolute;top:-200px;right:-150px;width:620px;height:760px;background:#DC5F00;transform:rotate(15deg);z-index:0;"></div>

        <!-- Contenu -->
        <div style="position:relative;z-index:1;width:100%;height:100%;display:flex;flex-direction:column;padding:52px 60px;box-sizing:border-box;">

            <!-- Header : logo 200px + titre centré + modélisation centré -->
            <div style="display:flex;align-items:flex-start;gap:24px;flex-shrink:0;">
                <img src="/images/logo.jpg" style="width:200px;height:200px;object-fit:contain;flex-shrink:0;" alt="Logo ${business.name}">
                <div style="flex:1;text-align:center;padding-top:8px;">
                    <p style="font-size:100px;font-weight:900;color:#3A3F43;font-family:Georgia,serif;line-height:1;margin:0 0 16px;text-shadow:0 2px 8px rgba(255,255,255,0.8);">${business.name}</p>
                    <p style="font-size:16px;color:#aaaaaa;letter-spacing:3px;text-transform:uppercase;margin:0;font-weight:400;">${business.tagline}</p>
                </div>
            </div>

            <!-- Event box -->
            <div style="flex:1;display:flex;align-items:center;min-height:0;">
                <div style="background:#3A3F43;border-radius:80px 20px 80px 20px;padding:42px 52px;width:100%;box-sizing:border-box;text-align:center;">
                    <h1 style="font-size:50px;font-weight:900;color:#ffffff;line-height:1.2;margin:0 0 18px;word-wrap:break-word;overflow-wrap:break-word;">${ev.nom}</h1>
                    <p style="font-size:20px;color:#DC5F00;font-weight:700;margin:0;">${date}</p>
                </div>
            </div>

            <!-- Card grise : photo gauche + card blanche alignée en bas -->
            <div style="height:300px;flex-shrink:0;background:#EEEEEE;border-radius:20px;padding:12px;box-sizing:border-box;display:flex;gap:12px;align-items:stretch;">
                <!-- Photo -->
                <div style="flex:1;border-radius:14px;overflow:hidden;background-image:url('/images/modele.jpg');background-size:135%;background-position:78% 55%;background-repeat:no-repeat;"></div>
                <!-- Card blanche alignée en haut, contact en bas -->
                <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;gap:10px;">
                    <div style="background:#ffffff;border-radius:14px;padding:12px;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;width:100%;box-sizing:border-box;flex:1;">
                        <img src="${src}" style="width:132px;height:132px;display:block;" crossorigin="anonymous" alt="QR">
                        <div style="text-align:center;">
                            <p style="font-size:10px;color:#666C7B;margin:0 0 4px;font-family:Arial,sans-serif;">Scanner le catalogue</p>
                            ${addressBox}
                        </div>
                    </div>
                    <div style="text-align:center;width:100%;flex-shrink:0;">
                        <p style="font-size:13px;font-weight:700;color:#3A3F43;margin:0 0 2px;">${business.social}</p>
                        <p style="font-size:12px;color:#666C7B;margin:0;">${business.phone ? `☎ ${business.phone}` : ''}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// ─── Export ───────────────────────────────────────────────────────────────────
export const TEMPLATES = [
    {
        id: 'prestige',
        label: 'Prestige',
        preview: '🌿',
        previewBg: '#1C3830',
        previewText: '#fff',
        generateHTML: generatePrestige,
    },
    {
        id: 'alpinia',
        label: 'Alpinia',
        preview: '🌺',
        previewBg: '#2B1F42',
        previewText: '#fff',
        generateHTML: generateAlpinia,
    },
    {
        id: 'simple',
        label: 'Simple',
        preview: '⬜',
        previewBg: '#EEEEEE',
        previewText: '#3A3F43',
        generateHTML: generateSimple,
    },
    {
        id: 'geo',
        label: 'Géo',
        preview: '◆',
        previewBg: '#DC5F00',
        previewText: '#fff',
        generateHTML: generateGeo,
    },
];
