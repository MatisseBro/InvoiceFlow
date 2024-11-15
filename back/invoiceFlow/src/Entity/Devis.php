<?php

namespace App\Entity;

use App\Repository\DevisRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DevisRepository::class)]
class Devis
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $numeroDevis = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateEnvoie = null;

    #[ORM\Column]
    private ?int $montantTotal = null;

    #[ORM\Column(length: 255)]
    private ?string $statut = null;

    #[ORM\Column]
    private ?int $montantTaxe = null;

    #[ORM\Column]
    private ?int $montantRemise = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateCreation = null;

    #[ORM\Column]
    private ?bool $estAccepter = null;

    #[ORM\Column(length: 255)]
    private ?string $conditionReglement = null;

    #[ORM\Column(length: 255)]
    private ?string $commentaireReglement = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateValidite = null;

    /**
     * @var Collection<int, ProduitsFacture>
     */
    #[ORM\OneToMany(targetEntity: ProduitsFacture::class, mappedBy: 'devis')]
    private Collection $produitsFactures;

    /**
     * @var Collection<int, ProduitsDevis>
     */
    #[ORM\OneToMany(targetEntity: ProduitsDevis::class, mappedBy: 'devis')]
    private Collection $produitsDevis;

    public function __construct()
    {
        $this->produitsFactures = new ArrayCollection();
        $this->produitsDevis = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumeroDevis(): ?int
    {
        return $this->numeroDevis;
    }

    public function setNumeroDevis(int $numeroDevis): static
    {
        $this->numeroDevis = $numeroDevis;

        return $this;
    }

    public function getDateEnvoie(): ?\DateTimeInterface
    {
        return $this->dateEnvoie;
    }

    public function setDateEnvoie(\DateTimeInterface $dateEnvoie): static
    {
        $this->dateEnvoie = $dateEnvoie;

        return $this;
    }

    public function getMontantTotal(): ?int
    {
        return $this->montantTotal;
    }

    public function setMontantTotal(int $montantTotal): static
    {
        $this->montantTotal = $montantTotal;

        return $this;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): static
    {
        $this->statut = $statut;

        return $this;
    }

    public function getMontantTaxe(): ?int
    {
        return $this->montantTaxe;
    }

    public function setMontantTaxe(int $montantTaxe): static
    {
        $this->montantTaxe = $montantTaxe;

        return $this;
    }

    public function getMontantRemise(): ?int
    {
        return $this->montantRemise;
    }

    public function setMontantRemise(int $montantRemise): static
    {
        $this->montantRemise = $montantRemise;

        return $this;
    }

    public function getDateCreation(): ?\DateTimeInterface
    {
        return $this->dateCreation;
    }

    public function setDateCreation(\DateTimeInterface $dateCreation): static
    {
        $this->dateCreation = $dateCreation;

        return $this;
    }

    public function isEstAccepter(): ?bool
    {
        return $this->estAccepter;
    }

    public function setEstAccepter(bool $estAccepter): static
    {
        $this->estAccepter = $estAccepter;

        return $this;
    }

    public function getConditionReglement(): ?string
    {
        return $this->conditionReglement;
    }

    public function setConditionReglement(string $conditionReglement): static
    {
        $this->conditionReglement = $conditionReglement;

        return $this;
    }

    public function getCommentaireReglement(): ?string
    {
        return $this->commentaireReglement;
    }

    public function setCommentaireReglement(string $commentaireReglement): static
    {
        $this->commentaireReglement = $commentaireReglement;

        return $this;
    }

    public function getDateValidite(): ?\DateTimeInterface
    {
        return $this->dateValidite;
    }

    public function setDateValidite(\DateTimeInterface $dateValidite): static
    {
        $this->dateValidite = $dateValidite;

        return $this;
    }

    /**
     * @return Collection<int, ProduitsFacture>
     */
    public function getProduitsFactures(): Collection
    {
        return $this->produitsFactures;
    }

    public function addProduitsFacture(ProduitsFacture $produitsFacture): static
    {
        if (!$this->produitsFactures->contains($produitsFacture)) {
            $this->produitsFactures->add($produitsFacture);
            $produitsFacture->setDevis($this);
        }

        return $this;
    }

    public function removeProduitsFacture(ProduitsFacture $produitsFacture): static
    {
        if ($this->produitsFactures->removeElement($produitsFacture)) {
            // set the owning side to null (unless already changed)
            if ($produitsFacture->getDevis() === $this) {
                $produitsFacture->setDevis(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ProduitsDevis>
     */
    public function getProduitsDevis(): Collection
    {
        return $this->produitsDevis;
    }

    public function addProduitsDevi(ProduitsDevis $produitsDevi): static
    {
        if (!$this->produitsDevis->contains($produitsDevi)) {
            $this->produitsDevis->add($produitsDevi);
            $produitsDevi->setDevis($this);
        }

        return $this;
    }

    public function removeProduitsDevi(ProduitsDevis $produitsDevi): static
    {
        if ($this->produitsDevis->removeElement($produitsDevi)) {
            // set the owning side to null (unless already changed)
            if ($produitsDevi->getDevis() === $this) {
                $produitsDevi->setDevis(null);
            }
        }

        return $this;
    }
}
