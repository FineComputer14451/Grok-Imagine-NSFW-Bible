const DODGE_TOKENS = [/\[DODGE_LAYER\]/g, /\[R_RATED_DODGE_LAYER\]/g, /\[ULTIMATE_DODGE_LAYER\]/g];

function createPromptEngine(edition) {
    const expandPrompt = (text, voice) => {
        const audioBlock = `${edition.baseAudioBlock} ${voice}`;
        let out = String(text)
            .replace(/\[ETHICAL_PREFIX\]/g, edition.ethicalPrefix)
            .replace(/\[AUDIO_BLOCK\]/g, audioBlock)
            .replace(/\[CONTINUITY_LOCK\]/g, edition.continuityLock);
        for (const token of DODGE_TOKENS) {
            out = out.replace(token, edition.dodgeLayer);
        }
        return out;
    };

    const composePrompt = (parts, { isSpicyMode = false, aspectRatio = null } = {}) => {
        const core = parts.filter(Boolean).map((p) => String(p).trim()).filter(Boolean).join(', ');
        let display = isSpicyMode ? `${edition.modePrefix}: ${core}` : core;
        if (aspectRatio) display += ` --ar ${aspectRatio}`;
        return display;
    };

    const toPrompt = (parts, options) => {
        const display = composePrompt(parts, options);
        return { display, raw: expandPrompt(display, options.voice) };
    };

    const copyText = (text, onSuccess) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    };

    const sanitizeText = (text) => {
        let newText = text;
        let count = 0;
        for (const { risk, safe } of edition.riskyReplacements) {
            const next = newText.replace(risk, safe);
            if (next !== newText) {
                count += 1;
                newText = next;
            }
        }
        return { text: newText, changed: count > 0 || newText !== text };
    };

    const buildPromptParts = ({
        styleId,
        boosterIds,
        isSpicyMode,
        useContinuity,
        subject,
        useDodge,
        useAudio,
    }) => {
        const parts = [];
        const styleObj = edition.artStyles.find((s) => s.id === styleId);
        if (styleObj) parts.push(styleObj.prompt);

        boosterIds.forEach((bId) => {
            const booster = edition.styleBoosters.find((b) => b.id === bId);
            if (booster) parts.push(booster.prompt);
        });

        if (isSpicyMode) parts.push('[ETHICAL_PREFIX]');
        if (useContinuity) parts.push('[CONTINUITY_LOCK]');
        if (subject) parts.push(subject);
        if (useDodge) parts.push('[DODGE_LAYER]');
        if (useAudio) parts.push('[AUDIO_BLOCK]');
        return parts;
    };

    return { expandPrompt, composePrompt, toPrompt, copyText, sanitizeText, buildPromptParts };
}