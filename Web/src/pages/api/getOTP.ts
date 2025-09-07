import crypto from 'crypto';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import type { NextApiRequest, NextApiResponse } from 'next';

const secretKey = 'qxdBfW31GnjfHG621DCSquug8bRiFy38';

// Function to encrypt data
const encryptData = (data: string): string => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

// Function to generate OTP and send via EmailJS
export const getOTP = async (email: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Mail/sendopt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: email
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to send OTP');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

// API handler for OTP verification and registration
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("Something")
    if (req.method === 'POST') {
        const { email, otp, username, password,name } = req.body;
        console.log('Received data:', { email, otp, username, password ,name});

        // Validate input
        if (!email || !otp || !username || !password ||!name) {
            console.error("Validation error: All fields are required.");
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Encrypt data
        const dataToEncrypt = `${username}|${otp}`;
        const encryptedData = encryptData(dataToEncrypt);
        console.log('Encrypted data:', encryptedData);

        try {
            // Send encrypted data to the putOTP API

            // Proceed with registration using fetch instead of axios
            const registerResponse = await fetch(`${process.env.API_URL}/api/Authentication/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    UserId: username,
                    Username: name,
                    Password: password,
                    Gmail: email,
                    OTP: otp
                })
            });

            const registerData = await registerResponse.json();
            console.log('Register response:', registerData);

            if (registerResponse.ok && registerData.statusCode === 200) {
                return res.status(200).json({ success: true, message: "Registration successful" });
            } else {
                return res.status(400).json({ success: false, message: registerData.message });
            }

        } catch (error) {
            console.error('Error during OTP verification or registration:', error);
            return res.status(500).json({ success: false, message: error.toString() });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
