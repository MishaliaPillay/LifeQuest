using System.ComponentModel.DataAnnotations;

namespace LifeQuest.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}