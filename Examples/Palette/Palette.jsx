/**
 * Main application file.
 * @author Stanislav Antos
 */

#targetengine "palette";

// MVC application launcher
#include "../../Brixy/includes/app-launcher.jsxinc";

var Palette = Palette || launch($.fileName);
Palette.processEvent('showPalette');
