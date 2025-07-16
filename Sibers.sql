-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Июл 16 2025 г., 10:07
-- Версия сервера: 9.1.0
-- Версия PHP: 8.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `Sibers`
--

-- --------------------------------------------------------

--
-- Структура таблицы `role`
--

CREATE TABLE `role` (
  `id` int NOT NULL,
  `role` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `role`
--

INSERT INTO `role` (`id`, `role`) VALUES
(1, 'USER'),
(2, 'ADMIN');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `first_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `last_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `id_Role` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `first_name`, `last_name`, `gender`, `birthdate`, `id_Role`) VALUES
(1, 'admin', '$2b$05$3F5DIfAM4hQhnPQ8S7lWuu8uKqzeX4zajr6p09dt09bFan7lqb8UC', NULL, NULL, NULL, NULL, 2),
(11, 'tech_guy', '$2b$05$Wk/wGU6wfCHDOZMSEeMNVuI4yLpo570/5jhfNo3mVpJaBXeAUtiTq', 'Дмитрий', 'Технов', 'M', '1990-08-12', 1),
(12, 'web_designer', '$2b$05$Ee7PGF3eCt3x.u7gJepjKeXpMHrxOJtq/./..yy9fkthVwnVMjpj2', 'Ольга', 'Вебова', 'F', '1993-04-25', 1),
(13, 'data_scientist', '$2b$05$indoQhIiDG5tnY/JPxpeSOD1EnqWRM4SZ8lhwtCGyi5oahProEF9m', 'Артем', 'Аналитиков', 'M', '1985-11-30', 1),
(14, 'dev_ops', '$2b$05$6PIwTnPbeBVkBYFXYKiIneFSOp4LIu0ZOK0Ewv9sqvAusWwWRRVXa', 'Сергей', 'Серверов', 'M', '1991-07-18', 1),
(15, 'ux_master', '$2b$05$vmpPwphq618sEGNqVcZWeuXTaDRgMNSEhyo958WDgKef.NCPA7GI.', 'Алина', 'Интерфейсова', 'F', '1994-02-09', 1),
(16, 'sys_admin', '$2b$05$Kiruc7vDjjv4jCK7N3f8UuVgktb8HojV3dWK4C3c4V9Oahvh5CFEq', 'Павел', 'Администраторов', 'M', '1988-09-15', 1);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_role` (`id_Role`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `role`
--
ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_Role`) REFERENCES `role` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
