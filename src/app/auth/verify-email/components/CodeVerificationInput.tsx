import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";

interface VerificationCodeInputProps {
    onComplete: (code: string) => void;
    length?: number;
    isLoading?: boolean;
    isDisabled?: boolean;
}

const CodeVerificationInput: React.FC<VerificationCodeInputProps> = ({
                                                                         onComplete,
                                                                         length = 6,
                                                                         isLoading = false,
                                                                         isDisabled = false
                                                                     }) => {
    const [code, setCode] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (inputRefs.current[0] && !isLoading && !isDisabled) {
            inputRefs.current[0].focus();
        }
    }, [isLoading, isDisabled]);

    const handleChange = (index: number, value: string) => {
        if (value.length <= 1) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < length - 1) {
                inputRefs.current[index + 1]?.focus();
            }

            if (newCode.every(digit => digit !== '')) {
                onComplete(newCode.join(''));
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-between space-x-2">
            {code.map((digit, index) => (
                <Input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={isDisabled ? '' : digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-10 h-12 text-center text-lg ${
                        isDisabled
                            ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                            : ''
                    }`}
                    disabled={isLoading || isDisabled}
                    readOnly={isDisabled}
                />
            ))}
        </div>
    );
};

export default CodeVerificationInput;