-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema pb2b2324_zoowaakoopii18_
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pb2b2324_zoowaakoopii18_
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pb2b2324_zoowaakoopii18_` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `pb2b2324_zoowaakoopii18_` ;

-- -----------------------------------------------------
-- Table `pb2b2324_zoowaakoopii18_`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pb2b2324_zoowaakoopii18_`.`user` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(28) NOT NULL,
  `password` VARCHAR(28) NOT NULL,
  `email` VARCHAR(50) NULL,
  `firstname` VARCHAR(200) NOT NULL,
  `lastname` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`userId`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `pb2b2324_zoowaakoopii18_`.`question`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pb2b2324_zoowaakoopii18_`.`question` (
  `questionId` INT NOT NULL AUTO_INCREMENT,
  `question` VARCHAR(500) NOT NULL,
  `questionSnippet` VARCHAR(200) NOT NULL,
  `questionDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP (6),
  `user_Id` INT NOT NULL,
  PRIMARY KEY (`questionId`, `user_Id`),
  INDEX `fk_question_user_idx` (`user_Id` ASC) VISIBLE,
  CONSTRAINT `fk_question_user`
    FOREIGN KEY (`user_Id`)
    REFERENCES `pb2b2324_zoowaakoopii18_`.`user` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `pb2b2324_zoowaakoopii18_`.`answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pb2b2324_zoowaakoopii18_`.`answer` (
  `answer` VARCHAR(500) NULL DEFAULT NULL,
  `answerAccepted` TINYINT NULL DEFAULT NULL,
  `answerVotes` INT NULL DEFAULT NULL,
  `user_Id` INT NOT NULL,
  `questionId` INT NOT NULL,
  `answerId` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`user_Id`, `questionId`, `answerId`),
  INDEX `fk_answer_user1_idx` (`user_Id` ASC) VISIBLE,
  INDEX `fk_answer_question1_idx` (`questionId` ASC) VISIBLE,
  CONSTRAINT `fk_answer_user1`
    FOREIGN KEY (`user_Id`)
    REFERENCES `pb2b2324_zoowaakoopii18_`.`user` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_answer_question1`
    FOREIGN KEY (`questionId`)
    REFERENCES `pb2b2324_zoowaakoopii18_`.`question` (`questionId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
