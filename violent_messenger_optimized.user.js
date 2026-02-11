// ==UserScript==
// @name         Violent Messenger Optimized
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tối ưu hóa hiệu suất Messenger.com: Giảm lag, tăng tốc độ phản hồi, tiết kiệm tài nguyên CPU/RAM.
// @author       Ket4min-Susan
// @match        https://www.messenger.com/*
// @match        https://www.facebook.com/messages/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=messenger.com
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    console.log('Violent Messenger Optimized: Đang khởi động...');

    // 1. Tối ưu CSS: Sử dụng content-visibility và giảm hiệu ứng nặng
    // Chúng ta sử dụng các selector chung hoặc attribute selector vì class của FB thường xuyên thay đổi (obfuscated).
    const optimizedCSS = `
        /* Kích hoạt GPU acceleration cho toàn bộ trang để mượt hơn */
        body, #root {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            transform: translateZ(0); /* Kích hoạt layer composite */
        }

        /* Tối ưu hóa danh sách tin nhắn và danh sách chat */
        /* Sử dụng aria-label hoặc role để định danh các container chính */
        [role="grid"], [role="listbox"], [role="list"] {
            content-visibility: auto; /* Chỉ render khi scroll tới */
            contain-intrinsic-size: 1000px; /* Ước lượng chiều cao để tránh thanh cuộn bị nhảy */
            will-change: scroll-position;
        }

        /* Giảm bớt hiệu ứng backdrop-filter (làm mờ sau nền) - Rất nặng cho GPU */
        /* Giữ lại opacity để không làm mất hoàn toàn giao diện kính, nhưng bỏ tính toán blur */
        *:not(:hover) {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
        }

        /* Giảm shadow phức tạp cho các thành phần không quan trọng */
        div {
            box-shadow: none !important;
        }
        /* Khôi phục shadow cho modal/dialog/menu để giữ độ nổi khối cần thiết */
        [role="dialog"], [role="menu"], [role="tooltip"] {
            box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
        }

        /* Tối ưu ảnh */
        img {
            /* Giúp cuộn mượt hơn bằng cách không decode ảnh trên main thread */
            content-visibility: auto; 
        }

        /* Ẩn các hiệu ứng loading placeholder khi đã load xong (giảm paint) */
        .loading-skeleton {
            display: none !important;
        }
    `;

    // Inject CSS ngay lập tức
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.textContent = optimizedCSS;
    document.head.appendChild(styleSheet);

    // 2. Tối ưu JS Runtime

    // Hàm tối ưu hóa một node cụ thể (và con của nó)
    function optimizeNode(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return;

        // Nếu là ảnh, xử lý trực tiếp
        if (node.tagName === 'IMG') {
            if (node.decoding !== 'async') node.decoding = 'async';
            // Lazy load nếu chưa có
            if (!node.loading) node.loading = 'lazy';
            return;
        }

        // Nếu là container, tìm ảnh bên trong
        // Sử dụng getElementsByTagName nhanh hơn querySelectorAll
        const images = node.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            if (img.decoding !== 'async') img.decoding = 'async';
            if (!img.loading) img.loading = 'lazy';
        }
    }

    // Quan sát thay đổi DOM hiệu quả hơn
    const observer = new MutationObserver((mutations) => {
        // Sử dụng requestIdleCallback để xử lý batch nhằm tránh chặn UI thread
        const handleMutations = () => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    optimizeNode(node);
                });
            });
        };

        if (window.requestIdleCallback) {
            window.requestIdleCallback(handleMutations);
        } else {
            setTimeout(handleMutations, 100); // Fallback cho trình duyệt cũ
        }
    });

    // Bắt đầu quan sát
    const startObserving = () => {
        // Xử lý các node hiện có trước
        optimizeNode(document.body);

        // Bắt đầu observe
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('Violent Messenger Optimized: Đã kích hoạt observer.');
    };

    if (document.body) {
        startObserving();
    } else {
        window.addEventListener('DOMContentLoaded', startObserving);
    }

    console.log('Violent Messenger Optimized: Đã kích hoạt.');

})();
