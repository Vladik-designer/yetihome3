document.addEventListener('DOMContentLoaded', () => {
    // Форма и цена
    const form = document.getElementById('booking-form');
    const priceDiv = document.getElementById('price');
    const saunaCheckbox = document.getElementById('sauna');

    const prices = {
        "2": { "weekday": 400, "weekend": 450, "saturday": 650 },
        "4": { "weekday": 500, "weekend": 550, "saturday": 650 },
        "6": { "weekday": 600, "weekend": 650, "saturday": 750 },
        "8": { "weekday": 700, "weekend": 750, "saturday": 850 },
    };

    form.addEventListener('change', () => {
        const guests = document.getElementById('guests').value;
        const sauna = saunaCheckbox.checked ? 90 : 0;

        const dayOfWeek = new Date().getDay(); // 0 - Вс, 1 - Пн, ..., 6 - Сб
        let dayType = 'weekday';
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayType = dayOfWeek === 6 ? 'saturday' : 'weekend';
        }

        const totalPrice = prices[guests][dayType] + sauna;
        priceDiv.textContent = `Стоимость: ${totalPrice} BYN`;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        alert('Ваше бронирование отправлено!');
    });

    // Календарь
    function generateCalendar(month, year, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        const table = document.createElement('table');
        const header = document.createElement('tr');

        ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            header.appendChild(th);
        });

        table.appendChild(header);

        let row = document.createElement('tr');
        for (let i = 0; i < (firstDay.getDay() || 7) - 1; i++) {
            const td = document.createElement('td');
            row.appendChild(td);
        }

        for (let date = 1; date <= daysInMonth; date++) {
            const td = document.createElement('td');
            td.textContent = date;
            row.appendChild(td);

            if ((firstDay.getDay() + date - 1) % 7 === 0) {
                table.appendChild(row);
                row = document.createElement('tr');
            }
        }

        if (row.children.length > 0) {
            table.appendChild(row);
        }

        container.appendChild(table);
    }

    const now = new Date();
    generateCalendar(now.getMonth(), now.getFullYear(), 'month1');
    const nextMonth = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
    const nextYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    generateCalendar(nextMonth, nextYear, 'month2');

    // Telegram интеграция
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const guests = document.getElementById('guests').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const sauna = saunaCheckbox.checked;

        const message = `
            Заявка на бронирование:
            Количество гостей: ${guests}
            Даты: ${startDate} - ${endDate}
            Сауна: ${sauna ? 'Да' : 'Нет'}
        `.trim();

        try {
            const response = await fetch('https://api.telegram.org/bot<ВАШ_ТОКЕН>/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: '<ВАШ_CHAT_ID>',
                    text: message
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка отправки сообщения.');
            }
            alert('Заявка отправлена!');
        } catch (error) {
            console.error(error);
            alert('Не удалось отправить заявку. Проверьте подключение или повторите позже.');
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // --- Блокировка прошлых дат в календаре ---
    const today = new Date().toISOString().split("T")[0];
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const bookedDates = ["2024-11-19", "2024-11-20", "2024-11-25", "2024-12-03", "2024-12-09"]; // Пример забронированных дат
  
    startDateInput.setAttribute("min", today);
    endDateInput.setAttribute("min", today);
  
    startDateInput.addEventListener("change", function () {
      endDateInput.setAttribute("min", this.value);
    });
  
    // --- Заблокировать забронированные даты ---
    function disableBookedDates(input) {
      input.addEventListener("input", function () {
        if (bookedDates.includes(this.value)) {
          alert("Эта дата уже забронирована. Выберите другую.");
          this.value = ""; // Сбрасываем значение
        }
      });
    }
  
    disableBookedDates(startDateInput);
    disableBookedDates(endDateInput);
  
    // --- Галерея с пролистыванием ---
    document.querySelectorAll(".carousel").forEach(function (carousel) {
      const images = carousel.querySelectorAll("img");
      let currentIndex = 0;
  
      // Создаём кнопки
      const prevButton = document.createElement("button");
      prevButton.innerHTML = "◀";
      prevButton.classList.add("carousel-btn", "prev-btn");
  
      const nextButton = document.createElement("button");
      nextButton.innerHTML = "▶";
      nextButton.classList.add("carousel-btn", "next-btn");
  
      carousel.appendChild(prevButton);
      carousel.appendChild(nextButton);
  
      function updateGallery() {
        images.forEach((img, index) => {
          img.style.display = index === currentIndex ? "block" : "none";
        });
      }
  
      prevButton.addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateGallery();
      });
  
      nextButton.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % images.length;
        updateGallery();
      });
  
      updateGallery(); // Инициализация
    });
  });

  document.querySelectorAll(".faq-item h3").forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      answer.style.display = answer.style.display === "block" ? "none" : "block";
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
  const bookedDates = ["2024-11-19", "2024-11-20", "2024-11-25", "2024-12-03", "2024-12-09"]; // Забронированные даты
  const allDateCells = document.querySelectorAll("table tbody td");

  allDateCells.forEach((cell) => {
    if (cell.textContent.trim() !== "") {
      const cellDate = new Date(2024, 10, parseInt(cell.textContent.trim())); // Ноябрь: 10
      const cellDateString = cellDate.toISOString().split("T")[0];

      if (bookedDates.includes(cellDateString)) {
        cell.classList.add("booked");
        cell.style.textDecoration = "line-through";
        cell.style.color = "red";
      }
    }
  });
});

document.getElementById("booking-form").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
  
    if (!startDate || !endDate) {
      alert("Выберите даты для бронирования.");
      return;
    }
  
    // Добавляем даты в массив
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
  
    while (currentDate <= lastDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      if (!bookedDates.includes(dateString)) {
        bookedDates.push(dateString);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    alert("Бронирование успешно! Обновите календарь, чтобы увидеть забронированные даты.");
    // Обновить календарь
    allDateCells.forEach((cell) => {
      if (cell.textContent.trim() !== "") {
        const cellDate = new Date(2024, 10, parseInt(cell.textContent.trim())); // Ноябрь: 10
        const cellDateString = cellDate.toISOString().split("T")[0];
  
        if (bookedDates.includes(cellDateString)) {
          cell.classList.add("booked");
          cell.style.textDecoration = "line-through";
          cell.style.color = "red";
        }
      }
    });
  });

  
  document.getElementById("menu-toggle").addEventListener("click", () => {
    const navBar = document.querySelector("#nav-bar ul");
    navBar.classList.toggle("active");
});

document.querySelectorAll(".carousel").forEach((carousel) => {
    const images = carousel.querySelectorAll("img");
    let currentIndex = 0;

    const updateCarousel = () => {
        images.forEach((img, index) => {
            img.style.display = index === currentIndex ? "block" : "none";
        });
    };

    carousel.querySelector(".prev").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    });

    carousel.querySelector(".next").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    });

    updateCarousel();
});

function initMap() {
    const location = { lat: 53.9, lng: 27.5667 }; // Пример: Минск
    const map = new google.maps.Map(document.getElementById("google-map"), {
      zoom: 10,
      center: location,
    });
    const marker = new google.maps.Marker({
      position: location,
      map: map,
    });
  }
  