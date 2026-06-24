import fs from "fs"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"
import path from "path"
import { askAi } from "../services/openRouter.service.js"

export const analyzeResume = async (req, res) => {
    try {
        console.log("analyzeResume called. File:", req.file)
        if (!req.file) {
            console.log("analyzeResume: No file received in request")
            return res.status(400).json({ message: "Resume required " });
        }
        const filepath = req.file.path

        const fileBuffer = await fs.promises.readFile(filepath)
        const uint8Array = new Uint8Array(fileBuffer)
        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

        let resumeText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();

            const pageText = content.items.map(item => item.str).join(" ");
            resumeText += pageText + "\n";
        }

        resumeText = resumeText.replace(/\s+/g, " ").trim();

        const messages = [
            {
                role: "system",
                content: `
    Extract structured data from the resume. Make sure to extract ALL projects and ALL skills listed or described in the resume. Do not omit any projects or skills.

    Return strictly JSON format:

    {
        "role": "string",
        "experience": "string",
        "projects": ["project1", "project2"],
        "skills": ["skill1", "skill2"]
    }
    `
            },
            {
                role: "user",
                content: resumeText
            }
        ];
        console.log("Extracted Resume Text:", resumeText);
        const aiResponse = await askAi(messages);
        console.log("Raw AI Response:", aiResponse);
        const parsed = JSON.parse(aiResponse);
        fs.unlinkSync(filepath)

        return res.json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText: resumeText,
        });

    } catch (error) {
        console.log(error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: error.message });
    }
};
