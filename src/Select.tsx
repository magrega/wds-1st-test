import { FC, useEffect, useRef, useState } from 'react';
import styles from './select.module.css';

export type SelectOption = {
    label: string,
    value: string | number
}

export type MultipleSelectProps = {
    multiple: true,
    value: SelectOption[],
    onChange: (value: SelectOption[]) => void
}

export type SingleSelectProps = {
    multiple?: false,
    value?: SelectOption,
    onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
    options: SelectOption[],
} & (SingleSelectProps | MultipleSelectProps);

export const Select: FC<SelectProps> = ({ options, value, onChange, multiple }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const isOptionSelected = (option: SelectOption) => multiple ? value.includes(option) : option === value;

    const selectOption = (option: SelectOption) => {
        if (multiple) {
            if (value.includes(option)) {
                onChange(value.filter(o => o !== option));
            } else {
                onChange([...value, option])
            }
        } else {
            if (option !== value) onChange(option);
        }
    }

    const clearOptions = () => {
        multiple ? onChange([]) : onChange(undefined);
    }

    useEffect(() => {
        if (isOpen) setHighlightedIndex(0);
    }, [isOpen]);


    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) return;
            switch (e.code) {
                case "Enter":
                case "Space":
                    setIsOpen(prev => !prev);
                    if (isOpen) selectOption(options[highlightedIndex]);
                    break;
                case "Escape":
                    setIsOpen(false);
                    break;
                case "ArrowUp":
                case "ArrowDown":
                    if (!isOpen) {
                        setIsOpen(true);
                        break;
                    }
                    // eslint-disable-next-line no-case-declarations
                    const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
                    if (newValue >= 0 && newValue < options.length) setHighlightedIndex(newValue);
                    break;
            }
        }

        containerRef.current?.addEventListener('keydown', handler);
        return () => {
            containerRef.current?.removeEventListener('keydown', handler);
        }
    }, [isOpen, options, highlightedIndex])

    return <div
        ref={containerRef}
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen(prev => !prev)}
        tabIndex={0}
        className={styles.container}>
        <span className={styles.value}>
            {multiple ?
                value.map(value => (
                    <button
                        key={value.value}
                        className={styles.multiple}
                        onClick={e => {
                            e.stopPropagation();
                            selectOption(value);
                        }}
                    >{value.label}
                        <span className={styles['remove-btn']}>&times;</span>
                    </button>
                ))
                :
                value?.label}</span>
        <button
            className={styles['clear-btn']}
            onClick={e => {
                e.stopPropagation();
                clearOptions();
            }}
        >&times;</button>
        <div className={styles.divider}></div>
        <div
            className={styles.caret}></div>
        <ul
            className={`${styles.options} ${isOpen ? styles.show : ''}`}>
            {options.map((option, index) =>
                <li
                    key={option.value}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={(e) => {
                        e.stopPropagation();
                        selectOption(option);
                        setIsOpen(false);
                    }}
                    className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ''} ${index === highlightedIndex ? styles.highlighted : ""}`}>{option.label}</li>)}
        </ul>
    </div>
}