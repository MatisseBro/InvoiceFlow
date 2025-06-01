<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250601163940 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE client (id INT AUTO_INCREMENT NOT NULL, entreprise_id INT DEFAULT NULL, nom_entreprise VARCHAR(255) DEFAULT NULL, nom_contact VARCHAR(255) DEFAULT NULL, numero_telephone INT DEFAULT NULL, date_creation DATE DEFAULT NULL, siret VARCHAR(255) DEFAULT NULL, siren VARCHAR(255) DEFAULT NULL, type_client VARCHAR(255) DEFAULT NULL, adresse1 VARCHAR(255) DEFAULT NULL, adresse2 VARCHAR(255) DEFAULT NULL, code_postal VARCHAR(255) DEFAULT NULL, ville VARCHAR(255) DEFAULT NULL, pays VARCHAR(255) DEFAULT NULL, reference_client INT DEFAULT NULL, numero_tva VARCHAR(255) DEFAULT NULL, nom VARCHAR(255) DEFAULT NULL, prenom VARCHAR(255) DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, INDEX IDX_C7440455A4AEAFEA (entreprise_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE devis (id INT AUTO_INCREMENT NOT NULL, numero_devis INT NOT NULL, date_envoie DATE NOT NULL, montant_total INT NOT NULL, statut VARCHAR(255) NOT NULL, montant_taxe INT NOT NULL, montant_remise INT NOT NULL, date_creation DATE NOT NULL, est_accepter TINYINT(1) NOT NULL, condition_reglement VARCHAR(255) NOT NULL, commentaire_reglement VARCHAR(255) NOT NULL, date_validite DATE NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE entreprise (id INT AUTO_INCREMENT NOT NULL, nom_entreprise VARCHAR(255) DEFAULT NULL, numero_telephone INT DEFAULT NULL, adresse1 VARCHAR(255) DEFAULT NULL, adresse2 VARCHAR(255) DEFAULT NULL, code_postal VARCHAR(255) DEFAULT NULL, ville VARCHAR(255) DEFAULT NULL, pays VARCHAR(255) DEFAULT NULL, siret VARCHAR(255) DEFAULT NULL, siren VARCHAR(255) DEFAULT NULL, iban VARCHAR(255) DEFAULT NULL, bic VARCHAR(255) DEFAULT NULL, nom_banque VARCHAR(255) DEFAULT NULL, swift VARCHAR(255) DEFAULT NULL, condition_reglement VARCHAR(255) DEFAULT NULL, commentaire_reglement VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE facture (id INT AUTO_INCREMENT NOT NULL, client_id INT DEFAULT NULL, devis_id INT DEFAULT NULL, numero_facture INT NOT NULL, date_echeance DATE NOT NULL, date_envoie DATE NOT NULL, montant_total INT NOT NULL, statut VARCHAR(255) NOT NULL, montant_taxe INT NOT NULL, montant_remise INT NOT NULL, date_creation DATE NOT NULL, facture_reccurente TINYINT(1) NOT NULL, date_reglement DATE NOT NULL, condition_reglement VARCHAR(255) NOT NULL, commentaire_reglement VARCHAR(255) NOT NULL, INDEX IDX_FE86641019EB6921 (client_id), UNIQUE INDEX UNIQ_FE86641041DEFADA (devis_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE produits (id INT AUTO_INCREMENT NOT NULL, entreprise_id INT DEFAULT NULL, nom VARCHAR(255) NOT NULL, description VARCHAR(255) DEFAULT NULL, prix_ttc DOUBLE PRECISION NOT NULL, prix_ht DOUBLE PRECISION NOT NULL, quantite_stock INT NOT NULL, date_creation DATE NOT NULL, type VARCHAR(255) DEFAULT NULL, unite VARCHAR(255) DEFAULT NULL, tva DOUBLE PRECISION DEFAULT NULL, commentaire LONGTEXT DEFAULT NULL, INDEX IDX_BE2DDF8CA4AEAFEA (entreprise_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE produits_devis (id INT AUTO_INCREMENT NOT NULL, devis_id INT DEFAULT NULL, produit_id INT DEFAULT NULL, quantite INT NOT NULL, montant INT NOT NULL, INDEX IDX_FE50B16541DEFADA (devis_id), INDEX IDX_FE50B165F347EFB (produit_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE produits_facture (id INT AUTO_INCREMENT NOT NULL, produit_id INT DEFAULT NULL, facture_id INT DEFAULT NULL, quantite INT NOT NULL, montant INT NOT NULL, INDEX IDX_C714C6C9F347EFB (produit_id), INDEX IDX_C714C6C97F2DEE08 (facture_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, entreprise_id INT DEFAULT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL COMMENT '(DC2Type:json)', password VARCHAR(255) NOT NULL, nom VARCHAR(255) DEFAULT NULL, prenom VARCHAR(255) DEFAULT NULL, nom_entreprise VARCHAR(255) DEFAULT NULL, telephone INT DEFAULT NULL, profile_picture VARCHAR(255) DEFAULT NULL, INDEX IDX_8D93D649A4AEAFEA (entreprise_id), UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE client ADD CONSTRAINT FK_C7440455A4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE facture ADD CONSTRAINT FK_FE86641019EB6921 FOREIGN KEY (client_id) REFERENCES client (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE facture ADD CONSTRAINT FK_FE86641041DEFADA FOREIGN KEY (devis_id) REFERENCES devis (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE produits ADD CONSTRAINT FK_BE2DDF8CA4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE produits_devis ADD CONSTRAINT FK_FE50B16541DEFADA FOREIGN KEY (devis_id) REFERENCES devis (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE produits_devis ADD CONSTRAINT FK_FE50B165F347EFB FOREIGN KEY (produit_id) REFERENCES produits (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE produits_facture ADD CONSTRAINT FK_C714C6C9F347EFB FOREIGN KEY (produit_id) REFERENCES produits (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE produits_facture ADD CONSTRAINT FK_C714C6C97F2DEE08 FOREIGN KEY (facture_id) REFERENCES facture (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user ADD CONSTRAINT FK_8D93D649A4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE client DROP FOREIGN KEY FK_C7440455A4AEAFEA
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE facture DROP FOREIGN KEY FK_FE86641019EB6921
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE facture DROP FOREIGN KEY FK_FE86641041DEFADA
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE produits DROP FOREIGN KEY FK_BE2DDF8CA4AEAFEA
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE produits_devis DROP FOREIGN KEY FK_FE50B16541DEFADA
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE produits_devis DROP FOREIGN KEY FK_FE50B165F347EFB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE produits_facture DROP FOREIGN KEY FK_C714C6C9F347EFB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE produits_facture DROP FOREIGN KEY FK_C714C6C97F2DEE08
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user DROP FOREIGN KEY FK_8D93D649A4AEAFEA
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE client
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE devis
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE entreprise
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE facture
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE produits
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE produits_devis
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE produits_facture
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user
        SQL);
    }
}
