using System;
using System.Collections.Generic;

namespace backend.Models
{
    public partial class PlantaPower
    {
        public long Id { get; set; }
        public int IdI { get; set; }
        public int ActivePowerIm { get; set; }
        public float Division { get; set; }
    }
}
