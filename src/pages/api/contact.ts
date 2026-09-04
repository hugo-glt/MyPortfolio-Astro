import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_RECIPIENT } from 'astro:env/server';

export const prerender = false;

// --- Transporteur SMTP Gmail ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true pour le port 465 (SSL)    
    auth: {
    user: import.meta.env.GMAIL_USER,
    pass: import.meta.env.GMAIL_APP_PASSWORD,
    },
});

// --- Validation stricte des données entrantes ---
const contactSchema = z.object({
    name: z.string().trim().min(1, 'Nom requis').max(100),
    email: z.string().trim().email('Email invalide').max(254),
    message: z.string().trim().min(1, 'Message requis').max(5000),
    website: z.string().optional(), // honeypot
});

// --- Rate limiting persistant via SQLite ---
import Database from 'better-sqlite3';
import path from 'node:path';

const db = new Database(path.resolve('./data/rate-limit.db'));
db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
        ip TEXT NOT NULL,
        ts INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_ip_ts ON submissions(ip, ts);
`);

const RATE_LIMIT = 3;
const WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    db.prepare('DELETE FROM submissions WHERE ip = ? AND ts < ?').run(ip, windowStart);

    const count = db.prepare('SELECT COUNT(*) as c FROM submissions WHERE ip = ?').get(ip) as { c: number };
    if (count.c >= RATE_LIMIT) return true;

    db.prepare('INSERT INTO submissions (ip, ts) VALUES (?, ?)').run(ip, now);
    return false;
}

// --- Échappement HTML anti-injection ---
function escapeHtml(str: string): string {
    return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
    try {
    // 1. Rate limiting
    if (isRateLimited(clientAddress)) {
        return new Response(
        JSON.stringify({ error: 'Trop de tentatives. Réessaie plus tard.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // 2. Vérifier le Content-Type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        return new Response(
        JSON.stringify({ error: 'Format invalide' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const body = await request.json();

    // 3. Validation Zod stricte
    const result = contactSchema.safeParse(body);
    if (!result.success) {
        return new Response(
        JSON.stringify({ error: 'Données invalides', details: result.error.flatten() }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { name, email, message, website } = result.data;

    // 4. Honeypot — si rempli, c'est un bot
    if (website) {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // 5. Envoi via Gmail SMTP
    await transporter.sendMail({
    from: `"Portfolio Contact" <${GMAIL_USER}>`,
        to: CONTACT_RECIPIENT,
        replyTo: email,
        subject: `Nouveau message de ${escapeHtml(name)}`,
        html: `
        <h2>Nouveau message depuis le formulaire de contact</h2>
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Message :</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        `,
    });

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });

    } catch (error) {
    console.error('Erreur envoi contact:', error); 
    return new Response(
        JSON.stringify({ error: 'Erreur serveur' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
    }
};