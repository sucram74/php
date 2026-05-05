<?php
$boards = [
    [
        'title' => 'Projeto Web',
        'description' => 'Planejamento do novo site institucional.',
        'lists' => [
            [
                'title' => 'Backlog',
                'cards' => [
                    ['title' => 'Definir layout inicial', 'labels' => ['Design']],
                    ['title' => 'Mapear requisitos com o cliente', 'labels' => ['Produto']],
                ],
            ],
            [
                'title' => 'Em andamento',
                'cards' => [
                    ['title' => 'Criar protótipo em alta fidelidade', 'labels' => ['Design', 'UI']],
                ],
            ],
            [
                'title' => 'Concluído',
                'cards' => [
                    ['title' => 'Reunião de kick-off', 'labels' => ['Time']],
                ],
            ],
        ],
    ],
    [
        'title' => 'Sprint Mobile',
        'description' => 'Entregas da sprint do aplicativo.',
        'lists' => [
            [
                'title' => 'A fazer',
                'cards' => [
                    ['title' => 'Implementar login social', 'labels' => ['Auth']],
                    ['title' => 'Ajustar fluxo de onboarding', 'labels' => ['UX']],
                ],
            ],
            [
                'title' => 'QA',
                'cards' => [
                    ['title' => 'Testar push notifications', 'labels' => ['Teste']],
                ],
            ],
        ],
    ],
];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TaskFlow - Plataforma estilo Trello</title>
    <style>
        :root {
            --bg: #f3f5f9;
            --surface: #ffffff;
            --surface-muted: #eef1f7;
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --text: #111827;
            --text-muted: #4b5563;
            --border: #dbe1ea;
            --danger: #ef4444;
            --shadow: 0 10px 22px rgba(13, 39, 80, 0.12);
            --radius: 14px;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Inter, Segoe UI, system-ui, -apple-system, sans-serif;
        }

        body {
            background: linear-gradient(180deg, #ecf2ff 0%, var(--bg) 35%);
            color: var(--text);
            min-height: 100vh;
        }

        header {
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 20;
        }

        .topbar {
            max-width: 1200px;
            margin: 0 auto;
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
            letter-spacing: 0.2px;
        }

        .brand-badge {
            width: 32px;
            height: 32px;
            border-radius: 10px;
            background: linear-gradient(135deg, var(--primary), #38bdf8);
            box-shadow: var(--shadow);
        }

        .board-controls {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        select,
        input,
        button,
        textarea {
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 10px 12px;
            background: #fff;
            color: var(--text);
            font: inherit;
        }

        button {
            cursor: pointer;
            border: none;
            background: var(--primary);
            color: #fff;
            font-weight: 600;
            transition: 0.2s ease;
        }

        button:hover {
            background: var(--primary-dark);
        }

        main {
            max-width: 1200px;
            margin: 24px auto;
            padding: 0 24px 32px;
        }

        .board-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 18px;
            gap: 12px;
        }

        .board-title {
            font-size: 1.55rem;
            font-weight: 700;
        }

        .board-description {
            color: var(--text-muted);
            margin-top: 4px;
        }

        .kanban {
            display: flex;
            gap: 16px;
            overflow-x: auto;
            padding-bottom: 8px;
        }

        .list {
            background: var(--surface-muted);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            min-width: 290px;
            width: 290px;
            display: flex;
            flex-direction: column;
            max-height: calc(100vh - 230px);
        }

        .list-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            padding: 14px;
        }

        .list-title {
            font-weight: 700;
            font-size: 0.98rem;
        }

        .cards {
            overflow-y: auto;
            padding: 0 12px 12px;
            min-height: 70px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            box-shadow: 0 6px 16px rgba(9, 30, 66, 0.08);
            padding: 10px;
            cursor: grab;
        }

        .card.dragging {
            opacity: 0.45;
            transform: rotate(1deg);
        }

        .card-title {
            font-size: 0.93rem;
            line-height: 1.3;
            margin-bottom: 8px;
        }

        .labels {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }

        .label {
            font-size: 0.73rem;
            border-radius: 999px;
            padding: 3px 8px;
            background: #dbeafe;
            color: #1e40af;
        }

        .dropzone {
            border: 2px dashed #93c5fd;
            border-radius: 10px;
            min-height: 58px;
            background: #eff6ff;
        }

        .add-card {
            padding: 12px;
            border-top: 1px solid var(--border);
            display: grid;
            gap: 8px;
        }

        .add-card button {
            width: fit-content;
            padding-inline: 14px;
        }

        .ghost-btn {
            background: transparent;
            color: var(--text-muted);
            border: 1px solid var(--border);
        }

        .ghost-btn:hover {
            background: #f8fafc;
        }

        .danger-btn {
            background: #fee2e2;
            color: #991b1b;
            font-size: 0.8rem;
            padding: 5px 8px;
        }

        .danger-btn:hover {
            background: #fecaca;
        }

        .new-list {
            min-width: 290px;
            width: 290px;
            background: rgba(255, 255, 255, 0.7);
            border: 2px dashed #bfdbfe;
            border-radius: var(--radius);
            padding: 14px;
            display: grid;
            gap: 8px;
            height: fit-content;
        }

        @media (max-width: 760px) {
            .topbar,
            main {
                padding-inline: 14px;
            }

            .board-header {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="topbar">
            <div class="brand">
                <span class="brand-badge"></span>
                <span>TaskFlow</span>
            </div>
            <div class="board-controls">
                <label for="board-select">Quadro:</label>
                <select id="board-select"></select>
                <button id="new-board-btn">Novo quadro</button>
            </div>
        </div>
    </header>

    <main>
        <section class="board-header">
            <div>
                <h1 class="board-title" id="board-title"></h1>
                <p class="board-description" id="board-description"></p>
            </div>
        </section>

        <section class="kanban" id="kanban"></section>
    </main>

    <script>
        const state = {
            boards: <?php echo json_encode($boards, JSON_UNESCAPED_UNICODE); ?>,
            activeBoardIndex: 0,
        };

        const boardSelect = document.getElementById('board-select');
        const boardTitle = document.getElementById('board-title');
        const boardDescription = document.getElementById('board-description');
        const kanban = document.getElementById('kanban');

        function uid() {
            return Math.random().toString(36).slice(2, 9);
        }

        function renderBoardOptions() {
            boardSelect.innerHTML = '';
            state.boards.forEach((board, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = board.title;
                if (index === state.activeBoardIndex) {
                    option.selected = true;
                }
                boardSelect.appendChild(option);
            });
        }

        function createCardElement(card) {
            const cardEl = document.createElement('article');
            cardEl.className = 'card';
            cardEl.draggable = true;
            cardEl.dataset.cardId = card.id;

            const title = document.createElement('p');
            title.className = 'card-title';
            title.textContent = card.title;

            const labels = document.createElement('div');
            labels.className = 'labels';
            (card.labels || []).forEach((name) => {
                const tag = document.createElement('span');
                tag.className = 'label';
                tag.textContent = name;
                labels.appendChild(tag);
            });

            const remove = document.createElement('button');
            remove.className = 'danger-btn';
            remove.type = 'button';
            remove.textContent = 'Excluir';
            remove.addEventListener('click', () => {
                const board = state.boards[state.activeBoardIndex];
                for (const list of board.lists) {
                    const idx = list.cards.findIndex((item) => item.id === card.id);
                    if (idx >= 0) {
                        list.cards.splice(idx, 1);
                        break;
                    }
                }
                render();
            });

            cardEl.append(title, labels, remove);

            cardEl.addEventListener('dragstart', (event) => {
                cardEl.classList.add('dragging');
                event.dataTransfer.setData('text/plain', card.id);
            });

            cardEl.addEventListener('dragend', () => {
                cardEl.classList.remove('dragging');
            });

            return cardEl;
        }

        function createListElement(list) {
            const listEl = document.createElement('section');
            listEl.className = 'list';
            listEl.dataset.listId = list.id;

            const header = document.createElement('div');
            header.className = 'list-header';

            const listTitle = document.createElement('h2');
            listTitle.className = 'list-title';
            listTitle.textContent = list.title;

            const removeListBtn = document.createElement('button');
            removeListBtn.className = 'danger-btn';
            removeListBtn.type = 'button';
            removeListBtn.textContent = 'Remover';
            removeListBtn.addEventListener('click', () => {
                const board = state.boards[state.activeBoardIndex];
                board.lists = board.lists.filter((item) => item.id !== list.id);
                render();
            });

            header.append(listTitle, removeListBtn);

            const cardsArea = document.createElement('div');
            cardsArea.className = 'cards';

            cardsArea.addEventListener('dragover', (event) => {
                event.preventDefault();
                cardsArea.classList.add('dropzone');
            });

            cardsArea.addEventListener('dragleave', () => {
                cardsArea.classList.remove('dropzone');
            });

            cardsArea.addEventListener('drop', (event) => {
                event.preventDefault();
                cardsArea.classList.remove('dropzone');
                const cardId = event.dataTransfer.getData('text/plain');
                moveCard(cardId, list.id);
            });

            list.cards.forEach((card) => cardsArea.appendChild(createCardElement(card)));

            const addCard = document.createElement('form');
            addCard.className = 'add-card';
            addCard.innerHTML = `
                <input name="title" placeholder="Nova tarefa" required maxlength="120" />
                <input name="labels" placeholder="Labels (separadas por vírgula)" />
                <button type="submit">Adicionar cartão</button>
            `;

            addCard.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(addCard);
                const title = String(formData.get('title') || '').trim();
                const labels = String(formData.get('labels') || '')
                    .split(',')
                    .map((entry) => entry.trim())
                    .filter(Boolean);

                if (!title) return;

                list.cards.push({ id: uid(), title, labels });
                addCard.reset();
                render();
            });

            listEl.append(header, cardsArea, addCard);
            return listEl;
        }

        function createNewListElement() {
            const wrapper = document.createElement('form');
            wrapper.className = 'new-list';
            wrapper.innerHTML = `
                <h3>Adicionar nova lista</h3>
                <input name="title" placeholder="Ex.: Revisão" required maxlength="50" />
                <button type="submit">Criar lista</button>
            `;

            wrapper.addEventListener('submit', (event) => {
                event.preventDefault();
                const title = new FormData(wrapper).get('title').toString().trim();
                if (!title) return;

                state.boards[state.activeBoardIndex].lists.push({
                    id: uid(),
                    title,
                    cards: [],
                });
                wrapper.reset();
                render();
            });

            return wrapper;
        }

        function moveCard(cardId, targetListId) {
            const board = state.boards[state.activeBoardIndex];
            let draggedCard = null;

            for (const list of board.lists) {
                const cardIndex = list.cards.findIndex((card) => card.id === cardId);
                if (cardIndex >= 0) {
                    [draggedCard] = list.cards.splice(cardIndex, 1);
                    break;
                }
            }

            if (!draggedCard) return;

            const target = board.lists.find((list) => list.id === targetListId);
            if (!target) return;
            target.cards.push(draggedCard);
            render();
        }

        function normalizeData() {
            state.boards = state.boards.map((board) => ({
                ...board,
                id: board.id || uid(),
                lists: (board.lists || []).map((list) => ({
                    ...list,
                    id: list.id || uid(),
                    cards: (list.cards || []).map((card) => ({
                        ...card,
                        id: card.id || uid(),
                    })),
                })),
            }));
        }

        function render() {
            const board = state.boards[state.activeBoardIndex];
            boardTitle.textContent = board.title;
            boardDescription.textContent = board.description;
            kanban.innerHTML = '';
            board.lists.forEach((list) => kanban.appendChild(createListElement(list)));
            kanban.appendChild(createNewListElement());
            renderBoardOptions();
        }

        boardSelect.addEventListener('change', (event) => {
            state.activeBoardIndex = Number(event.target.value);
            render();
        });

        document.getElementById('new-board-btn').addEventListener('click', () => {
            const title = prompt('Nome do quadro:');
            if (!title) return;

            const description = prompt('Descrição (opcional):') || 'Quadro criado agora.';
            state.boards.push({
                id: uid(),
                title: title.trim(),
                description: description.trim(),
                lists: [
                    { id: uid(), title: 'A fazer', cards: [] },
                    { id: uid(), title: 'Em andamento', cards: [] },
                    { id: uid(), title: 'Concluído', cards: [] },
                ],
            });
            state.activeBoardIndex = state.boards.length - 1;
            render();
        });

        normalizeData();
        render();
    </script>
</body>
</html>
