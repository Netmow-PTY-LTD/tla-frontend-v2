'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Type,
    Image as ImageIcon,
    Minus,
    MousePointer2,
    Settings2,
    Save,
    Trash2,
    ChevronLeft,
    GripVertical,
    Plus,
    Monitor,
    Smartphone,
    Tablet,
    Eye,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { useAddEmailTemplateMutation } from '@/store/features/admin/emailApiService';
import { showSuccessToast, showErrorToast } from '@/components/common/toasts';
import { useRouter } from 'next/navigation';

// ─────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────
const BLOCK_TYPES = {
    TEXT: 'text',
    HEADING: 'heading',
    IMAGE: 'image',
    BUTTON: 'button',
    DIVIDER: 'divider',
    SPACER: 'spacer',
};

const PALETTE_COLORS = [
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#FFFFFF',
    '#00c3c0', '#0EA5E9', '#6366F1', '#8B5CF6', '#EC4899',
    '#ff8602', '#F59E0B', '#10B981', '#EF4444', '#F43F5E',
];

const defaultBlockStyles = {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: '#FFFFFF',
    color: '#1e293b',
    fontSize: 16,
    textAlign: 'left',
    borderRadius: 0,
};

function newBlock(type) {
    const id = Math.random().toString(36).slice(2, 10);
    const base = { id, type, styles: { ...defaultBlockStyles } };
    switch (type) {
        case BLOCK_TYPES.TEXT:
            return { ...base, content: '<p>Click here to edit this text block.</p>' };
        case BLOCK_TYPES.HEADING:
            return { ...base, content: '<h2>Section Heading</h2>', styles: { ...defaultBlockStyles, fontSize: 28, fontWeight: 700 } };
        case BLOCK_TYPES.IMAGE:
            return { ...base, src: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&q=80&w=1170', alt: 'Email image', styles: { ...defaultBlockStyles, paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 } };
        case BLOCK_TYPES.BUTTON:
            return { ...base, text: 'Click Here', url: '#', styles: { ...defaultBlockStyles, backgroundColor: '#00c3c0', color: '#FFFFFF', textAlign: 'center', borderRadius: 12 } };
        case BLOCK_TYPES.DIVIDER:
            return { ...base, styles: { ...defaultBlockStyles, paddingTop: 8, paddingBottom: 8 } };
        case BLOCK_TYPES.SPACER:
            return { ...base, height: 40 };
        default:
            return base;
    }
}

// ─────────────────────────────────────────
//  Sortable Block
// ─────────────────────────────────────────
function SortableBlock({ block, isSelected, onSelect, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };

    return (
        <div ref={setNodeRef} style={style} onClick={(e) => { e.stopPropagation(); onSelect(block.id); }}
            className={`group relative rounded-lg transition-all border-2 ${isSelected ? 'border-[#00c3c0] ring-4 ring-[#00c3c0]/10' : 'border-transparent hover:border-slate-200'}`}>
            {/* Drag handle */}
            <div {...attributes} {...listeners}
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1.5 text-slate-300 hover:text-slate-500 transition-opacity">
                <GripVertical className="w-4 h-4" />
            </div>
            {/* Delete */}
            {isSelected && (
                <button onClick={(e) => { e.stopPropagation(); onDelete(block.id); }}
                    className="absolute -right-3 -top-3 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            )}
            <BlockRenderer block={block} />
        </div>
    );
}

// ─────────────────────────────────────────
//  Block Renderer (Canvas preview)
// ─────────────────────────────────────────
function BlockRenderer({ block }) {
    const s = block.styles || {};
    const containerStyle = {
        paddingTop: s.paddingTop, paddingBottom: s.paddingBottom,
        paddingLeft: s.paddingLeft, paddingRight: s.paddingRight,
        backgroundColor: s.backgroundColor,
        borderRadius: s.borderRadius,
    };
    const textStyle = { color: s.color, fontSize: s.fontSize, textAlign: s.textAlign };

    switch (block.type) {
        case BLOCK_TYPES.TEXT:
        case BLOCK_TYPES.HEADING:
            return (
                <div style={containerStyle}>
                    <div style={textStyle} dangerouslySetInnerHTML={{ __html: block.content }} className="prose prose-slate max-w-none" />
                </div>
            );
        case BLOCK_TYPES.IMAGE:
            return (
                <div style={containerStyle}>
                    <img src={block.src} alt={block.alt} className="w-full object-cover" style={{ borderRadius: s.borderRadius }} />
                </div>
            );
        case BLOCK_TYPES.BUTTON:
            return (
                <div style={{ ...containerStyle, display: 'flex', justifyContent: s.textAlign === 'center' ? 'center' : s.textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
                    <a href={block.url} style={{ backgroundColor: s.backgroundColor, color: s.color, borderRadius: s.borderRadius, fontSize: s.fontSize, padding: '12px 32px', display: 'inline-block', fontWeight: 700, textDecoration: 'none' }}>
                        {block.text}
                    </a>
                </div>
            );
        case BLOCK_TYPES.DIVIDER:
            return (
                <div style={containerStyle}>
                    <hr style={{ borderColor: s.color || '#e2e8f0' }} />
                </div>
            );
        case BLOCK_TYPES.SPACER:
            return <div style={{ height: block.height || 40, backgroundColor: 'transparent' }} className="border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300 text-xs font-mono">spacer · {block.height || 40}px</div>;
        default:
            return null;
    }
}

// ─────────────────────────────────────────
//  HTML Export utility
// ─────────────────────────────────────────
function generateHTML(blocks) {
    const blocksHtml = blocks.map(block => {
        const s = block.styles || {};
        const wrap = (inner) => `<div style="padding:${s.paddingTop}px ${s.paddingRight}px ${s.paddingBottom}px ${s.paddingLeft}px;background-color:${s.backgroundColor};border-radius:${s.borderRadius}px;">${inner}</div>`;

        switch (block.type) {
            case BLOCK_TYPES.TEXT:
            case BLOCK_TYPES.HEADING:
                return wrap(`<div style="color:${s.color};font-size:${s.fontSize}px;text-align:${s.textAlign};">${block.content}</div>`);
            case BLOCK_TYPES.IMAGE:
                return wrap(`<img src="${block.src}" alt="${block.alt}" style="width:100%;display:block;" />`);
            case BLOCK_TYPES.BUTTON:
                return wrap(`<div style="text-align:${s.textAlign};"><a href="${block.url}" style="background-color:${s.backgroundColor};color:${s.color};border-radius:${s.borderRadius}px;font-size:${s.fontSize}px;padding:12px 32px;display:inline-block;font-weight:700;text-decoration:none;">${block.text}</a></div>`);
            case BLOCK_TYPES.DIVIDER:
                return wrap(`<hr style="border:none;border-top:1px solid ${s.color || '#e2e8f0'};" />`);
            case BLOCK_TYPES.SPACER:
                return `<div style="height:${block.height || 40}px;"></div>`;
            default:
                return '';
        }
    }).join('\n');

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Email</title></head><body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><div style="max-width:600px;margin:0 auto;background:#fff;">\n${blocksHtml}\n</div></td></tr></table></body></html>`;
}

// ─────────────────────────────────────────
//  Property Panel
// ─────────────────────────────────────────
function PropertyPanel({ block, onUpdate }) {
    if (!block) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center opacity-50">
                <MousePointer2 className="w-12 h-12 text-slate-300 stroke-1 mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select a block to edit its properties</p>
            </div>
        );
    }

    const s = block.styles || {};
    const set = (key, val) => onUpdate(block.id, { styles: { ...(block.styles || {}), [key]: val } });

    return (
        <ScrollArea className="flex-1 min-h-0">
            <div className="p-5 space-y-6 text-sm">
                <Badge className="bg-[#ff8602]/10 text-[#ff8602] border-[#ff8602]/20 uppercase text-[9px] tracking-widest px-3 py-1">
                    {block.type}
                </Badge>

                {/* Content fields */}
                {(block.type === BLOCK_TYPES.TEXT || block.type === BLOCK_TYPES.HEADING) && (
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">HTML Content</Label>
                        <textarea
                            className="w-full min-h-[120px] p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00c3c0]/20 focus:border-[#00c3c0] resize-none outline-none"
                            value={block.content}
                            onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                        />
                    </div>
                )}
                {block.type === BLOCK_TYPES.IMAGE && (
                    <>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Image URL</Label>
                            <Input className="h-9 text-xs rounded-xl" value={block.src} onChange={(e) => onUpdate(block.id, { src: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Alt Text</Label>
                            <Input className="h-9 text-xs rounded-xl" value={block.alt} onChange={(e) => onUpdate(block.id, { alt: e.target.value })} />
                        </div>
                    </>
                )}
                {block.type === BLOCK_TYPES.BUTTON && (
                    <>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Label</Label>
                            <Input className="h-9 text-xs rounded-xl font-bold" value={block.text} onChange={(e) => onUpdate(block.id, { text: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">URL</Label>
                            <Input className="h-9 text-xs rounded-xl" value={block.url} onChange={(e) => onUpdate(block.id, { url: e.target.value })} />
                        </div>
                    </>
                )}
                {block.type === BLOCK_TYPES.SPACER && (
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Height (px)</Label>
                        <Input type="number" className="h-9 text-xs rounded-xl" value={block.height || 40} onChange={(e) => onUpdate(block.id, { height: Number(e.target.value) })} />
                    </div>
                )}

                <Separator />

                {/* Typography */}
                {block.type !== BLOCK_TYPES.DIVIDER && block.type !== BLOCK_TYPES.SPACER && block.type !== BLOCK_TYPES.IMAGE && (
                    <>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Typography</Label>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-slate-400 w-20 shrink-0">Font Size</span>
                                <input type="range" min={10} max={64} value={s.fontSize || 16} onChange={(e) => set('fontSize', Number(e.target.value))} className="flex-1 accent-[#00c3c0]" />
                                <span className="text-xs font-mono font-bold w-8 text-right text-slate-600">{s.fontSize || 16}</span>
                            </div>
                            <div className="flex gap-1.5">
                                {[
                                    { align: 'left', icon: AlignLeft },
                                    { align: 'center', icon: AlignCenter },
                                    { align: 'right', icon: AlignRight },
                                ].map(({ align, icon: Icon }) => (
                                    <button key={align} onClick={() => set('textAlign', align)}
                                        className={`flex-1 h-9 flex items-center justify-center rounded-xl border transition-all ${s.textAlign === align ? 'bg-[#00c3c0]/10 border-[#00c3c0]/30 text-[#00c3c0]' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                                        <Icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Separator />
                    </>
                )}

                {/* Colors */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Background Color</Label>
                    <div className="flex flex-wrap gap-2">
                        {PALETTE_COLORS.map(c => (
                            <button key={c} onClick={() => set('backgroundColor', c)}
                                style={{ backgroundColor: c }}
                                className={`w-7 h-7 rounded-lg border-2 transition-all ${s.backgroundColor === c ? 'border-slate-800 scale-110 shadow-md' : 'border-white hover:scale-110 shadow-sm hover:shadow-md'}`} />
                        ))}
                        <input type="color" value={s.backgroundColor || '#FFFFFF'} onChange={(e) => set('backgroundColor', e.target.value)}
                            className="w-7 h-7 rounded-lg border-2 border-slate-200 cursor-pointer overflow-hidden p-0" title="Custom color" />
                    </div>
                </div>

                {block.type !== BLOCK_TYPES.DIVIDER && block.type !== BLOCK_TYPES.SPACER && block.type !== BLOCK_TYPES.IMAGE && (
                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Text Color</Label>
                        <div className="flex flex-wrap gap-2">
                            {PALETTE_COLORS.map(c => (
                                <button key={c} onClick={() => set('color', c)}
                                    style={{ backgroundColor: c }}
                                    className={`w-7 h-7 rounded-lg border-2 transition-all ${s.color === c ? 'border-slate-800 scale-110 shadow-md' : 'border-white hover:scale-110 shadow-sm hover:shadow-md'}`} />
                            ))}
                            <input type="color" value={s.color || '#1e293b'} onChange={(e) => set('color', e.target.value)}
                                className="w-7 h-7 rounded-lg border-2 border-slate-200 cursor-pointer overflow-hidden p-0" title="Custom color" />
                        </div>
                    </div>
                )}

                <Separator />

                {/* Spacing */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Padding</Label>
                    {[
                        { label: 'Top', key: 'paddingTop' },
                        { label: 'Bottom', key: 'paddingBottom' },
                        { label: 'Left', key: 'paddingLeft' },
                        { label: 'Right', key: 'paddingRight' },
                    ].map(({ label, key }) => (
                        <div key={key} className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-400 w-14 shrink-0">{label}</span>
                            <input type="range" min={0} max={80} value={s[key] ?? 16} onChange={(e) => set(key, Number(e.target.value))} className="flex-1 accent-[#00c3c0]" />
                            <span className="text-xs font-mono font-bold w-8 text-right text-slate-600">{s[key] ?? 16}px</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Corner Radius</Label>
                    <div className="flex items-center gap-3">
                        <input type="range" min={0} max={48} value={s.borderRadius ?? 0} onChange={(e) => set('borderRadius', Number(e.target.value))} className="flex-1 accent-[#00c3c0]" />
                        <span className="text-xs font-mono font-bold w-8 text-right text-slate-600">{s.borderRadius ?? 0}px</span>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}

// ─────────────────────────────────────────
//  Save-as-Template Modal
// ─────────────────────────────────────────
function SaveModal({ open, onClose, onConfirm, isSaving }) {
    const [form, setForm] = useState({ title: '', templateKey: '', subject: '' });
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Save as <span className="text-[#00c3c0]">Template</span></h2>
                    <p className="text-slate-500 text-sm mt-1 italic">Your design will be exported as HTML and saved.</p>
                </div>
                <div className="space-y-4">
                    {[
                        { label: 'Template Title', key: 'title', placeholder: 'Welcome Email' },
                        { label: 'Unique Key', key: 'templateKey', placeholder: 'welcome_email', mono: true },
                        { label: 'Email Subject', key: 'subject', placeholder: 'Hello {{userName}}!' },
                    ].map(({ label, key, placeholder, mono }) => (
                        <div key={key} className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</Label>
                            <Input
                                className={`h-10 rounded-xl ${mono ? 'font-mono text-[13px]' : ''}`}
                                placeholder={placeholder}
                                value={form[key]}
                                onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
                    <Button
                        disabled={isSaving || !form.title || !form.templateKey || !form.subject}
                        onClick={() => onConfirm(form)}
                        className="flex-1 bg-[#00c3c0] hover:bg-[#00c3c0]/90 rounded-xl text-white font-bold gap-2"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? 'Saving...' : 'Save Template'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────
const INITIAL = [
    newBlock(BLOCK_TYPES.HEADING),
    newBlock(BLOCK_TYPES.TEXT),
    newBlock(BLOCK_TYPES.BUTTON),
];

export default function EmailBuilderPage() {
    const router = useRouter();
    const [blocks, setBlocks] = useState(INITIAL);
    const [activeId, setActiveId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [viewMode, setViewMode] = useState('desktop');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [addTemplate, { isLoading: isSaving }] = useAddEmailTemplateMutation();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = ({ active, over }) => {
        if (over && active.id !== over.id) {
            setBlocks(prev => {
                const oi = prev.findIndex(b => b.id === active.id);
                const ni = prev.findIndex(b => b.id === over.id);
                return arrayMove(prev, oi, ni);
            });
        }
        setActiveId(null);
    };

    const addBlock = (type) => {
        const b = newBlock(type);
        setBlocks(prev => [...prev, b]);
        setSelectedId(b.id);
    };

    const deleteBlock = (id) => {
        setBlocks(prev => prev.filter(b => b.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const updateBlock = (id, updates) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const handleSave = async (meta) => {
        const html = generateHTML(blocks);
        try {
            await addTemplate({
                title: meta.title,
                templateKey: meta.templateKey,
                templateType: 'generic',
                subject: meta.subject,
                body: html,
                variables: [],
            }).unwrap();
            showSuccessToast('Template saved successfully!');
            setShowSaveModal(false);
            router.push('/admin/email/template/list');
        } catch (err) {
            showErrorToast(err?.data?.message || 'Failed to save template.');
        }
    };

    const selectedBlock = blocks.find(b => b.id === selectedId);
    const canvasWidth = viewMode === 'mobile' ? 375 : viewMode === 'tablet' ? 600 : 800;

    const BLOCK_PALETTE = [
        { type: BLOCK_TYPES.HEADING, icon: Type, label: 'Heading' },
        { type: BLOCK_TYPES.TEXT, icon: Type, label: 'Text' },
        { type: BLOCK_TYPES.IMAGE, icon: ImageIcon, label: 'Image' },
        { type: BLOCK_TYPES.BUTTON, icon: MousePointer2, label: 'Button' },
        { type: BLOCK_TYPES.DIVIDER, icon: Minus, label: 'Divider' },
        { type: BLOCK_TYPES.SPACER, icon: Eye, label: 'Spacer' },
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-0px)] bg-[#f8fafc] overflow-hidden">

            {/* ── Top bar ── */}
            <header className="h-14 bg-white border-b flex items-center justify-between px-5 shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9" asChild>
                        <Link href="/admin/email/template/list"><ChevronLeft className="w-4 h-4 text-slate-500" /></Link>
                    </Button>
                    <div className="h-7 w-px bg-slate-100" />
                    <div>
                        <h1 className="text-sm font-black text-slate-900 leading-tight">Visual Email <span className="text-[#00c3c0]">Builder</span></h1>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Drag · Drop · Design</p>
                    </div>
                </div>

                {/* View toggles */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {[
                        { mode: 'desktop', icon: Monitor },
                        { mode: 'tablet', icon: Tablet },
                        { mode: 'mobile', icon: Smartphone },
                    ].map(({ mode, icon: Icon }) => (
                        <button key={mode} onClick={() => setViewMode(mode)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${viewMode === mode ? 'bg-white shadow-sm text-[#00c3c0]' : 'text-slate-400 hover:text-slate-600'}`}>
                            <Icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-9 rounded-xl text-[10px] uppercase font-bold tracking-widest px-4 border-slate-200"
                        onClick={() => {
                            const html = generateHTML(blocks);
                            const blob = new Blob([html], { type: 'text/html' });
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = 'email-template.html';
                            a.click();
                        }}>
                        Export HTML
                    </Button>
                    <Button onClick={() => setShowSaveModal(true)}
                        className="h-9 bg-[#00c3c0] hover:bg-[#00c3c0]/90 text-white rounded-xl text-[10px] uppercase font-bold tracking-widest px-5 shadow-lg shadow-[#00c3c0]/20 gap-2">
                        <Save className="w-3.5 h-3.5" /> Save Template
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">

                {/* ── Left: Block palette ── */}
                <aside className="w-56 bg-white border-r shrink-0 flex flex-col">
                    <div className="p-4 border-b">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add Blocks</p>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-3 grid grid-cols-2 gap-2">
                            {BLOCK_PALETTE.map(({ type, icon: Icon, label }) => (
                                <button key={type} onClick={() => addBlock(type)}
                                    className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-[#00c3c0]/30 hover:shadow-lg transition-all group text-center">
                                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-[#00c3c0] group-hover:border-[#00c3c0]/30 transition-colors shadow-sm">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700">{label}</span>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </aside>

                {/* ── Center: Canvas ── */}
                <main className="flex-1 overflow-auto p-10" onClick={() => setSelectedId(null)}>
                    <div className="mx-auto transition-all duration-300" style={{ width: canvasWidth, maxWidth: '100%' }}>
                        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/80 overflow-hidden border border-slate-100">
                            <div className="h-10 bg-slate-50 border-b flex items-center px-4 gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                                <span className="ml-2 text-[9px] font-mono text-slate-400 uppercase tracking-widest">email canvas · {canvasWidth}px</span>
                            </div>

                            <DndContext sensors={sensors} collisionDetection={closestCenter}
                                onDragStart={e => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
                                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                                    <div className="px-10 py-8 min-h-[600px] space-y-1">
                                        {blocks.length === 0 ? (
                                            <div className="h-64 flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-2xl text-slate-300">
                                                <Plus className="w-10 h-10 mb-3 stroke-1 animate-pulse" />
                                                <p className="text-xs font-bold uppercase tracking-wider">Add blocks from the left panel</p>
                                            </div>
                                        ) : (
                                            blocks.map(block => (
                                                <SortableBlock key={block.id} block={block}
                                                    isSelected={selectedId === block.id}
                                                    onSelect={setSelectedId} onDelete={deleteBlock} />
                                            ))
                                        )}
                                    </div>
                                </SortableContext>

                                <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.3' } } }) }}>
                                    {activeId ? (
                                        <div className="bg-white border-2 border-[#00c3c0] rounded-xl p-4 shadow-2xl opacity-80">
                                            <GripVertical className="w-5 h-5 text-[#00c3c0]" />
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        </div>
                    </div>
                </main>

                {/* ── Right: Properties ── */}
                <aside className="w-72 bg-white border-l shrink-0 flex flex-col overflow-hidden">
                    <div className="p-4 border-b flex items-center gap-2 shrink-0">
                        <Settings2 className="w-4 h-4 text-[#ff8602]" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">Properties</p>
                    </div>
                    <PropertyPanel block={selectedBlock} onUpdate={updateBlock} />
                </aside>
            </div>

            {/* ── Save modal ── */}
            <SaveModal open={showSaveModal} onClose={() => setShowSaveModal(false)} onConfirm={handleSave} isSaving={isSaving} />
        </div>
    );
}
