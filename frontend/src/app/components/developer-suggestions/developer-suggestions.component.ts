import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { SUGGESTED_BOOKS } from '../../data/books.data';
import { BOOK_EXCERPTS, BookExcerpt } from '../../data/book-excerpts.data';
import { SuggestedBook } from '../../models/book.model';

@Component({
  selector: 'app-developer-suggestions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="suggestions-page container">
      
      <!-- Section Header -->
      <div class="suggestions-header glass-panel">
        <div class="header-content">
          <div class="badge badge-cyan mb-2">
            <span>💡 {{ langService.isHindi() ? 'डेवलपर द्वारा अनुशंसित पुस्तकें' : 'Suggestions by Developer' }}</span>
          </div>
          <h1 class="header-title">
            {{ langService.isHindi() ? 'आकर्षण का नियम एवं मानसिक शक्ति ग्रंथ' : 'Law of Attraction & Subconscious Mind Classics' }}
          </h1>
          <p class="header-subtitle">
            {{ langService.isHindi() 
              ? 'सकारात्मकता, अवचेतन मन की रीप्रोग्रामिंग और प्रचुरता पर विश्वप्रसिद्ध पुस्तकों का मुफ़्त सैंपल पढ़ें। संपूर्ण पुस्तक अमेज़न से प्राप्त करें।' 
              : 'Handpicked foundational masterpieces on thought attraction and mind power. Read a free sample preview below, or purchase the full edition on Amazon.' }}
          </p>
        </div>
      </div>

      <!-- Books Grid -->
      <div class="books-grid">
        @for (book of books; track book.id) {
          <div class="book-card glass-panel-interactive">
            
            <!-- Book Cover Header -->
            <div class="book-cover" [style.background]="book.cover_gradient">
              <span class="book-icon">{{ book.icon }}</span>
              <div class="cover-info">
                <span class="book-year">{{ book.year }} Classic • Free Sample</span>
                <h3 class="cover-title">{{ langService.isHindi() && book.hindi_title ? book.hindi_title : book.title }}</h3>
                <span class="cover-author">by {{ langService.isHindi() && book.hindi_author ? book.hindi_author : book.author }}</span>
              </div>
            </div>

            <!-- Book Details -->
            <div class="card-body">
              <p class="book-summary">
                {{ langService.isHindi() && book.hindi_summary ? book.hindi_summary : book.summary }}
              </p>

              <div class="takeaways-box">
                <span class="takeaway-label">
                  🔑 {{ langService.isHindi() ? 'मुख्य सीख (Key Principles):' : 'Key Principles:' }}
                </span>
                <ul class="takeaway-list">
                  @if (langService.isHindi() && book.hindi_takeaways) {
                    @for (t of book.hindi_takeaways; track $index) {
                      <li>• {{ t }}</li>
                    }
                  } @else {
                    @for (t of book.key_takeaways; track $index) {
                      <li>• {{ t }}</li>
                    }
                  }
                </ul>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="card-actions">
              <button class="btn btn-primary read-btn" (click)="openNativeReader(book)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <span>{{ langService.isHindi() ? 'मुफ़्त सैंपल' : 'Free Sample' }}</span>
              </button>

              <a [href]="book.amazon_url" target="_blank" rel="noopener noreferrer" class="btn btn-accent buy-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                <span>{{ langService.isHindi() ? 'अमेज़न से खरीदें' : 'Buy on Amazon' }}</span>
              </a>
            </div>

          </div>
        }
      </div>

      <!-- In-App Native Document Reader Modal -->
      @if (activeBook()) {
        <div class="reader-modal-backdrop" (click)="closeReader()">
          <div class="reader-modal-card glass-panel" (click)="$event.stopPropagation()">
            
            <!-- Reader Modal Header -->
            <div class="reader-modal-header">
              <div class="reader-title-box">
                <span class="book-emoji">{{ activeBook()?.icon }}</span>
                <div>
                  <h3 class="reader-book-title">
                    {{ langService.isHindi() && activeBook()?.hindi_title ? activeBook()?.hindi_title : activeBook()?.title }}
                  </h3>
                  <span class="reader-author">by {{ activeBook()?.author }}</span>
                </div>
              </div>

              <div class="reader-header-actions">
                <a [href]="activeBook()?.amazon_url" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm">
                  🛒 {{ langService.isHindi() ? 'अमेज़न से खरीदें' : 'Buy on Amazon' }}
                </a>
                <button class="close-reader-btn" (click)="closeReader()" title="Close Reader">✕</button>
              </div>
            </div>

            <!-- Fair Use Sample Notice Banner -->
            <div class="preview-notice-banner">
              📖 <strong>{{ langService.isHindi() ? 'मुफ़्त सैंपल पूर्वावलोकन:' : 'Free Sample Preview:' }}</strong>
              {{ langService.isHindi() 
                ? 'आप इस पुस्तक के प्रथम अध्यायों का पूर्वावलोकन कर रहे हैं। पूरी पुस्तक पढ़ने के लिए अमेज़न बटन पर क्लिक करें।' 
                : 'You are reading an authentic sample excerpt. To read the complete master edition, purchase the book on Amazon.' }}
            </div>

            <!-- Book Reader Document Paper Body -->
            <div class="reader-body-container" [style.fontSize.rem]="fontSize()">
              
              @if (currentExcerptPage(); as page) {
                <div class="book-paper glass-panel">
                  <div class="paper-header">
                    <span class="chapter-badge">Chapter Excerpt</span>
                    <h2 class="chapter-title">
                      {{ langService.isHindi() && page.hindi_title ? page.hindi_title : page.title }}
                    </h2>
                  </div>

                  <div class="paper-content">
                    @if (langService.isHindi() && page.hindi_content) {
                      @for (p of page.hindi_content; track $index) {
                        <p class="paragraph">{{ p }}</p>
                      }
                    } @else {
                      @for (p of page.content; track $index) {
                        <p class="paragraph">{{ p }}</p>
                      }
                    }
                  </div>

                  <div class="paper-footer">
                    <span class="page-number-tag">Page {{ page.page_number }} of {{ totalExcerptPages() }}</span>
                  </div>
                </div>
              }

            </div>

            <!-- Reader Navigation Footer -->
            <div class="reader-modal-footer">
              <div class="font-controls">
                <button class="font-btn" (click)="adjustFontSize(-0.1)" title="Decrease font size">A-</button>
                <button class="font-btn" (click)="adjustFontSize(0.1)" title="Increase font size">A+</button>
              </div>

              <div class="page-nav-controls">
                <button 
                  class="btn btn-secondary btn-sm" 
                  [disabled]="currentPageIndex() === 0" 
                  (click)="prevPage()"
                >
                  ◄ Previous Page
                </button>

                <span class="page-indicator">
                  {{ currentPageIndex() + 1 }} / {{ totalExcerptPages() }}
                </span>

                <button 
                  class="btn btn-secondary btn-sm" 
                  [disabled]="currentPageIndex() >= totalExcerptPages() - 1" 
                  (click)="nextPage()"
                >
                  Next Page ►
                </button>
              </div>

              <a [href]="activeBook()?.amazon_url" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                🛒 Buy Full Book
              </a>
            </div>

          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .suggestions-page {
      padding-top: 32px;
      padding-bottom: 120px;
      display: flex;
      flex-direction: column;
      gap: 36px;
    }
    .suggestions-header {
      padding: 36px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08));
      border: 1px solid rgba(99, 102, 241, 0.2);
    }
    .header-content {
      max-width: 850px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .header-title {
      font-size: 2.3rem;
      font-weight: 800;
    }
    .header-subtitle {
      font-size: 1.05rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 28px;
    }
    .book-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .book-cover {
      padding: 24px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
    }
    .book-icon {
      font-size: 2.5rem;
      background: rgba(255, 255, 255, 0.2);
      width: 60px;
      height: 60px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    .cover-info {
      display: flex;
      flex-direction: column;
    }
    .book-year {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.85;
    }
    .cover-title {
      font-size: 1.25rem;
      font-weight: 800;
      line-height: 1.25;
      color: #ffffff;
    }
    .cover-author {
      font-size: 0.85rem;
      opacity: 0.9;
      margin-top: 2px;
    }

    .card-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex: 1;
    }
    .book-summary {
      font-size: 0.92rem;
      color: var(--text-muted);
      line-height: 1.5;
    }
    .takeaways-box {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border-subtle);
      padding: 14px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .takeaway-label {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--cyan);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .takeaway-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 0.84rem;
      color: var(--text-muted);
    }

    .card-actions {
      padding: 16px 24px 24px;
      display: flex;
      gap: 10px;
    }
    .read-btn {
      flex: 1;
      font-size: 0.88rem;
    }
    .buy-btn {
      font-size: 0.88rem;
      white-space: nowrap;
    }

    /* In-App Reader Modal */
    .reader-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .reader-modal-card {
      width: 100%;
      max-width: 860px;
      height: 85vh;
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border: 1px solid var(--border-highlight);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
      overflow: hidden;
      border-radius: 20px;
    }
    .reader-modal-header {
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-subtle);
      background: rgba(10, 15, 25, 0.9);
    }
    .reader-title-box {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .book-emoji { font-size: 1.8rem; }
    .reader-book-title { font-size: 1.15rem; font-weight: 800; }
    .reader-author { font-size: 0.82rem; color: var(--text-muted); }

    .reader-header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .close-reader-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .close-reader-btn:hover { background: rgba(244, 63, 94, 0.3); color: #ffffff; }

    .preview-notice-banner {
      background: rgba(6, 182, 212, 0.12);
      border-bottom: 1px solid rgba(6, 182, 212, 0.2);
      padding: 8px 24px;
      font-size: 0.82rem;
      color: var(--cyan);
      text-align: center;
    }

    .reader-body-container {
      flex: 1;
      padding: 32px;
      overflow-y: auto;
      display: flex;
      justify-content: center;
    }
    .book-paper {
      width: 100%;
      max-width: 720px;
      padding: 36px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
    }
    .chapter-badge {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--cyan);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .chapter-title {
      font-size: 1.5em;
      font-weight: 800;
      margin-top: 4px;
    }
    .paper-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      line-height: 1.7;
      color: var(--text-main);
    }
    .paragraph {
      font-size: 1em;
      text-align: justify;
    }
    .paper-footer {
      margin-top: auto;
      padding-top: 20px;
      border-top: 1px dashed var(--border-subtle);
      text-align: right;
    }
    .page-number-tag {
      font-size: 0.78rem;
      color: var(--text-subtle);
    }

    .reader-modal-footer {
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border-subtle);
      background: rgba(10, 15, 25, 0.9);
    }
    .font-controls {
      display: flex;
      gap: 6px;
    }
    .font-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .page-nav-controls {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .page-indicator {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-muted);
    }

    @media (max-width: 768px) {
      .books-grid { grid-template-columns: 1fr; }
      .reader-modal-card { height: 95vh; padding: 0; }
      .book-paper { padding: 20px; }
      .reader-modal-footer { flex-direction: column; gap: 10px; }
    }
  `]
})
export class DeveloperSuggestionsComponent {
  langService = inject(LanguageService);

  books: SuggestedBook[] = SUGGESTED_BOOKS;
  activeBook = signal<SuggestedBook | null>(null);
  currentPageIndex = signal<number>(0);
  fontSize = signal<number>(1.0);

  currentExcerpt = computed(() => {
    const book = this.activeBook();
    if (!book) return null;
    return BOOK_EXCERPTS[book.id] || null;
  });

  currentExcerptPage = computed(() => {
    const exc = this.currentExcerpt();
    if (!exc || !exc.pages) return null;
    const idx = this.currentPageIndex();
    return exc.pages[idx] || exc.pages[0] || null;
  });

  totalExcerptPages = computed(() => {
    const exc = this.currentExcerpt();
    return exc?.pages?.length || 1;
  });

  openNativeReader(book: SuggestedBook) {
    this.activeBook.set(book);
    this.currentPageIndex.set(0);
  }

  closeReader() {
    this.activeBook.set(null);
  }

  nextPage() {
    if (this.currentPageIndex() < this.totalExcerptPages() - 1) {
      this.currentPageIndex.update(i => i + 1);
    }
  }

  prevPage() {
    if (this.currentPageIndex() > 0) {
      this.currentPageIndex.update(i => i - 1);
    }
  }

  adjustFontSize(delta: number) {
    const next = Math.max(0.85, Math.min(1.4, this.fontSize() + delta));
    this.fontSize.set(next);
  }
}
